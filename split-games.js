const parser =  require('./_split-parser.js')

const split = function(input, options) {
    let result = parser.parse(input, options)
    let res = []
    result.forEach(function (game) {
        let g = {}
        let ts = input.substring(game.tags.start.offset, game.tags.end.offset)
        let ps = input.substring(game.pgn.start.offset, game.pgn.end.offset)
        let all = ts + ps
        g.tags = ts; g.pgn = ps; g.all = all
        res.push(g)
    })
    return res
}

module.exports = {
    SyntaxError: parser.SyntaxError,
    split:       split
};