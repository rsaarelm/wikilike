/* wikilike.js version history
 *
 * 2.0      2018-11-28
 *          Rewritten to work as file reformatting footer script link.
 *
 * 1.0      2015-06-28
 *          Initial single page application style implementation.
 */
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/\$(\d+)/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

// Regex to match -> template string to replace the match with.
const escaped = [/`.*?`/, '<code>$0</code>'];
const hyperlink = [/\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]/i, '<a href="$0">$0</a>'];
const anchoredOffPageWord = [/\[(([A-Z][a-z0-9]+){2,})#(([A-Z][a-z0-9]+){2,})\]/, '[<a href="$1.wiki.html#$3">$1#$3</a>]'];
const alwaysOffPageWord = [/\[(([A-Z][a-z0-9]+){2,})\]/, '[<a href="$1.wiki.html">$1</a>]'];
const internalWord = [/\b(([A-Z][a-z0-9]+){2,})\b/, '<a href="#$1">$1</a>'];
const offPageWord = [/\b(([A-Z][a-z0-9]+){2,})\b/, '<a href="$1.wiki.html">$1</a>'];

function formatLineSegment(input, rules) {
    for (var i = 0; i < rules.length; i++) {
        var match = rules[i][0].exec(input);
        if (match) {
            var head = input.substring(0, match.index);
            var tail = input.substring(match.index + match[0].length);
            return formatLineSegment(head, rules) +
                rules[i][1].format(...match) +
                formatLineSegment(tail, rules);
        }
    }
    return input;
}

const captionRe = /^(([A-Z][a-z0-9]+){2,})$/;

function formatLine(input, rules) {
    // Return null if line should be discarded.
    if (/^#/.test(input)) { return null; }

    // Escape HTML tags.
    input = input.replace(/<(.*?)>/g, '&lt;$1&gt;');

    // Generate anchor ids for captions.
    if (captionRe.test(input)) {
        return '<div id="'+input+'"></div><b>'+input+'</b>';
    // Image link as the only thing on the input.
    } else if (input.match(/^([-A-Z0-9_.]+\.(png|jpg|jpeg|gif|bmp))$/i)) {
        return '<img src="'+input+'"/>';
    } else if (input.match(/^    /)) {
        // Full-input escape. Don't expand wikiwords but always do hyperlinks.
        return '<code>'+formatLineSegment(input, [hyperlink])+'</code>';
    } else {
        return formatLineSegment(input, rules);
    }
}

// Split document to lines for processing.
var lines = document.getElementsByTagName('body')[0].innerHTML.split(/\r?\n/);

// If there is more than one caption, treat this page as a multi-topic wiki.
var captionCount = 0;
for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (captionRe.test(line)) {
        captionCount += 1;
    }
}

// Encode different handling of regular WikiWord-s if there are multiple
// articles on the page in the rule list.
var linkRules = captionCount > 1 ?
    [escaped, hyperlink, anchoredOffPageWord, alwaysOffPageWord, internalWord] :
    [escaped, hyperlink, anchoredOffPageWord, alwaysOffPageWord, offPageWord];

// Process lines for wikilike markup.
var processedLines = [];
for (var i = 0; i < lines.length; i++) {
    var line = formatLine(lines[i], linkRules);
    if (line !== null) { processedLines.push(line); }
}

// Turn processed lines into a <pre> document.
document.getElementsByTagName('body')[0].innerHTML = "<pre>"+processedLines.join("\n")+"</pre>";

// Add styling.
var sheet = document.createElement('style')
sheet.innerHTML = "code {color: DimGray;}";
document.body.appendChild(sheet);
