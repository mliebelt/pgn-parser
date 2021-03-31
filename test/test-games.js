let parser = require("../pgn-parser.js");

let should = require('should');

function parse_games(string) {
    return parser.parse(string, {startRule: "games"})
}

describe("When working with many games", function () {
    it("should read 0 games", function () {
        let res = parse_games("")
        should.exist(res)
    })
    it("should read 0 games with whitespace", function () {
        let res = parse_games("\n\n")
        should.exist(res)
    })
    it("should read one game", function () {
        let res = parse_games('[White "Me"] [Black "Magnus"] 1. f4 e5 2. g4 Qh4#')
        should.exist(res)
        should(res.length).equal(1)
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
    // The following is wrong, and will be corrected in ticket #44.
    xit("should understand 3 minimal games (parsed wrong, see #44)", function () {
        let res = parse_games('*1. e4 e5 1-0 1. e4 *')
        should.exist(res)
        should(res.length).equal(3)
    })
    xit ("should understand 2 normal games, with linefeeds in between (parsed wrong, see #44)", function () {
        let res = parse_games("1. e4 *\n\n1. d4")
        should.exist(res)
        should(res.length).equal(2)
    })
    xit ("should understand 2 normal games, with variants, with linefeeds in between (parsed wrong, see #44)", function () {
        let res = parse_games("1. e4 *\n\n1. d4 d5 (1... e5)")
        should.exist(res)
        should(res.length).equal(2)
    })
    it ("should understand 2 normal games with tags, with linefeeds in between", function () {
        let res = parse_games("[White \"Me\"]1. e4 *\n\n[Black \"You\"]1. d4")
        should.exist(res)
        should(res.length).equal(2)
    })
    it ("should understand 2 normal games with last game with tags, with linefeeds in between", function () {
        let res = parse_games("1. e4 *\n\n[Black \"You\"]1. d4")
        should.exist(res)
        should(res.length).equal(2)
    })
    xit ("should understand 2 games with last game only comment and moves (parsed wrong, see #44)", function () {
        let res = parse_games("1. e4 e5 * { comment } 1. d4 d5 *")
        should.exist(res)
        should(res.length).equal(2)
    })
    it ("should understand 2 games with last game tags, comment and moves", function () {
        let res = parse_games("1. e4 e5 * [White \"Me\"] { comment } 1. d4 d5 *")
        should.exist(res)
        should(res.length).equal(2)
    })
    it ("should ignore whitespace before and after games", function () {
        let res = parse_games("\n\n1. e4 * \n\n[White \"Me\"] *  ")
        should.exist(res)
    })
})