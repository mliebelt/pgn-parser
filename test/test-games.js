let parser = require("../pgn-parser.js");

let should = require('should');

function parse_games(string) {
    return parser.parse(string, {startRule: "games"})
}

describe("When working with many games", function () {
    it("should read one game", function () {
        let res = parse_games('[White "Me"] [Black "Magnus"] 1. f4 e5 2. g4 Qh4#')
        should.exist(res)
        let moves = res[0].moves
        let pgn = ''
        for (let move of moves) {
            pgn += move.notation.notation
            pgn += ' '
        }
        should(pgn).equal("f4 e5 g4 Qh4# ")
    })
    it("should read 2 games without whitespace in between", function () {
        let input = '[UTCDate "2021.03.08"] [UTCTime "10:30:52"] [Variant "Standard"] [ECO "C57"] [Opening "Italian Game: Two Knights Defense, Fried Liver Attack"] [Annotator ""] 1. e4 e5 *[Event "name2"] [Site ""] [Result "*"] [UTCDate "2021.03.08"] [UTCTime "10:30:52"] [Variant "Standard"] [ECO "C57"] [Opening "Italian Game: Two Knights Defense, Fried Liver Attack"] [Annotator ""] 1. e4 e5 *'
        let res = parse_games(input)
        should.exist(res)
    })
    it ("should read all combinations of games, with and without whitespace in between", function () {
        let res = parse_games('[White "Me"] *[White "Me"]1. e4 e5 * ')
        should.exist(res)
        should(res.length).equal(2)
    })
    it("should understand the minimal game ever", function () {
        let res = parse_games('*')
        should.exist(res)
        should(res.length).equal(1)
    })
    // The following is wrong, and will be corrected in another ticket.
    it("should understand 3 minimal games", function () {
        let res = parse_games('*1. e4 e5 1-0 1. e4 *')
        should.exist(res)
        should(res.length).equal(2)
    })
})