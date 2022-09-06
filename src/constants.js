// ***************************************
// REGEXES
// ***************************************

// Matches any well-formed non-empty line, in this format:
// Optional *, then alternating text or string literals (non-greedy), then modifiers, then { and code, or // and a comment
exports.LINE_WHOLE =
    /^\s*(((-s|\.s|\$s|-|!!|!|\.\.|~~|~|\$|\+\?|\+|#[^\s]+)\s+)*)(\*{1,3}\s+|(\[|\])\s*(\/\/.*)?$)?(('([^\\']|(\\\\)*\\.)*'|"([^\\"]|(\\\\)*\\.)*"|\[([^\]]|(\\\\)*\\.)*\]|.*?)+?)((\s+(-s|\.s|\$s|-|!!|!|\.\.|~~|~|\$|\+\?|\+|#[^\s]+))*)(\s+(\{[^}]*$))?(\s*\[\s*)?(\s*(\/\/.*))?\s*$/;

// Matches a line that starts a sequential step block
exports.SEQ_MODIFIER_LINE = /^\s*\.\.\s*(\/\/.*)?$/;

// Matches a line that's entirely a // comment
exports.FULL_LINE_COMMENT = /^\s*\/\//;

// Matches 'string', handles escaped \ and '
exports.SINGLE_QUOTE_STR = /(?<!(\\\\)*\\)('([^\\']|(\\\\)*\\.)*')/g;

// Matches "string", handles escaped \ and "
exports.DOUBLE_QUOTE_STR = /(?<!(\\\\)*\\)("([^\\"]|(\\\\)*\\.)*")/g;

// Matches [string], handles escaped \, [, and ]
exports.BRACKET_STR = /(?<!(\\\\)*\\)(\[([^\\\]]|(\\\\)*\\.)*\])/g;

// Matches "string", 'string', or [string], handles escaped chars
exports.STRING_LITERAL = new RegExp(
    exports.SINGLE_QUOTE_STR.source + '|' + exports.DOUBLE_QUOTE_STR.source + '|' + exports.BRACKET_STR.source,
    'g'
);

// Same as STRING_LITERAL, only matches the whole line
exports.STRING_LITERAL_WHOLE = new RegExp('^(' + exports.STRING_LITERAL.source + ')$');

// Matches "string" or 'string', handles escaped chars
exports.QUOTED_STRING_LITERAL = new RegExp(
    exports.SINGLE_QUOTE_STR.source + '|' + exports.DOUBLE_QUOTE_STR.source,
    'g'
);

// Same as QUOTED_STRING_LITERAL, only matches the whole line
exports.QUOTED_STRING_LITERAL_WHOLE = new RegExp('^(' + exports.QUOTED_STRING_LITERAL.source + ')$');

// Matches {var} or {{var}}
exports.VAR = /\{\{[^{}\\]+\}\}|\{[^{}\\]+\}/g;

// Same as VAR, only matches the whole line
exports.VAR_WHOLE = new RegExp('^' + exports.VAR.source + '$');

// Matches {var1} = Val1, {var2} = Val2, {{var3}} = Val3, etc. (minimum one {var}=Val) as the whole line
exports.VARS_SET_WHOLE =
    /^(\s*((\{[^{}\\]+\})|(\{\{[^{}\\]+\}\}))\s*(=|is)\s*(('([^\\']|(\\\\)*\\.)*'|"([^\\"]|(\\\\)*\\.)*"|\[([^\\\]]|(\\\\)*\\.)*\]|.*?)+?)\s*)(,\s*((\{[^{}\\]+\})|(\{\{[^{}\\]+\}\}))\s*(=|is)\s*(('([^\\']|(\\\\)*\\.)*'|"([^\\"]|(\\\\)*\\.)*"|\[([^\\\]]|(\\\\)*\\.)*\]|.*?)+?)\s*)*$/;

// Matches "string", 'string', [string], {var}, or {{var}}, handles escaped chars
exports.FUNCTION_INPUT = new RegExp(exports.STRING_LITERAL.source + '|' + exports.VAR.source, 'g');

// Matches a line with only numbers (after whitespace stripped out)
exports.NUMBERS_ONLY_WHOLE = /^[0-9.,]+$/;

// ***************************************
// PARSE
// ***************************************
exports.SPACES_PER_INDENT = 4;

exports.HOOK_NAMES = [
    'before every branch',
    'after every branch',
    'before every step',
    'after every step',
    'before everything',
    'after everything'
];
exports.FREQUENCIES = ['high', 'med', 'low'];

// ***************************************
// CONSOLE
// ***************************************
exports.CONSOLE_END_COLOR = '\x1b[0m';
exports.CONSOLE_START_RED = '\x1b[31m';
exports.CONSOLE_START_GRAY = '\x1b[30m';
