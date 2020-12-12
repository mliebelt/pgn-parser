var parser = require("../pgn-parser.js");

var should = require('should');

function parse_games(string) {
    return parser.parse(string, {startRule: "games"})
}

describe("When working with many games", function () {
    it("should read one game", function () {
        let res = parse_games('[White "Me"] [Black "Magnus"] 1. f4 e5 2. g4 Qh4#')
        should.exist(res)
        let moves = res[0].moves
        let pgn = ''
        for (move of moves) {
            pgn += move.notation.notation
            pgn += ' '
        }
        should(pgn).equal("f4 e5 g4 Qh4# ")
    })
})