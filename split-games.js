const normalizeLineEndings = (str, normalized = '\n') =>
    str.replace(/\r?\n/g, normalized);

const split = function(input, options) {
    // let result = parser.parse(input, options)
    let result = normalizeLineEndings(input).split("\n\n")
    let res = []
    let g = {}
    result.forEach(function (part) {
        if (part.startsWith('[')) {
            g.tags = part
        } else if (part) {
            g.pgn = part
            let game = g.tags ? g.tags + "\n\n" + g.pgn : g.pgn
            g.all = game
            res.push(g)
            g = {}
        }
    })
    return res
}

module.exports = {
    SyntaxError: parser.SyntaxError,
    split:       split
};