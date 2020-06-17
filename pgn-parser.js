const parser =  require('./_pgn-parser.js')

/**
 * Patches the original function, to avoid empty games. May include additional functionality
 * for understanding parse errors later.
 */
const parse = function(input, options) {
    // Had to trim the grammar to allow no whitespace after a game, this is consumed only when read many games
    // Therefore the strings are trimmed here.
    if (! options || (options.startRule === 'pgn')) {
        return parser.parse(input.trim())
    }
    let result = parser.parse(input, options)
    if (options && (options.startRule === 'games')) {
        // result should be an array of games. Check the last game, if it is empty, and remove it then
        if (! Array.isArray(result)) return result
        if (result.length === 0) return result
        let last = result.pop()
        if ( (Object.keys(last.tags).length > 0) || (last.moves.length > 0) ) {
            result.push(last)
        }
        return result
    }
    return result
}

module.exports = {
  SyntaxError: parser.SyntaxError,
  parse:       parse
};
