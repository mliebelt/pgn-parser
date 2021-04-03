let parser = require("../pgn-parser.js");

let should = require('should');

function parse_games(string) {
    return parser.parse(string, {startRule: "games"})
}

describe("When reading 0 games", function () {
    it("should read 0 games from empty string", function () {
        let res = parse_games("")
        should.exist(res)
        should(res.length).equal(0)
    })
    it("should read 0 games with whitespace", function () {
        let res = parse_games("\n\n")
        should.exist(res)
        should(res.length).equal(0)
    })
})
describe("When reading 1 game", function () {
    it("should read exactly one game", function () {
        let res = parse_games('[White "Me"] [Black "Magnus"] 1. f4 e5 2. g4 Qh4#')
        should.exist(res)
        should(res.length).equal(1)
    })
    it("should ignore whitespace before, in between and after that one game", function () {
        let res = parse_games('  [White "Me"] \t\n[Black "Magnus"] \t\t1. f4 e5 2. g4 Qh4#\n\n')
        should.exist(res)
        should(res.length).equal(1)
    })
    it("should understand the minimal game ever", function () {
        let res = parse_games('*')
        should.exist(res)
        should(res.length).equal(1)
    })
})

// For more examples how to read many games, see the tests in `test-time.js`.
describe("When reading more than 1 game", function () {
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
    // The following is wrong, and will be corrected in ticket #44.
    it("should understand 3 minimal games (parsed wrong, see #44)", function () {
        let res = parse_games('*1. e4 e5 1-0 1. e4 *')
        should.exist(res)
        should(res.length).equal(3)
    })
    it ("should understand 2 normal games, with linefeeds in between (parsed wrong, see #44)", function () {
        let res = parse_games("1. e4 *\n\n1. d4")
        should.exist(res)
        should(res.length).equal(2)
    })
    it ("should understand 2 normal games, with variants, with linefeeds in between (parsed wrong, see #44)", function () {
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
    it ("should understand 2 games with last game only comment and moves (parsed wrong, see #44)", function () {
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
        should(res.length).equal(2)
    })
    it ("should read 4 minimal games (not obvious)", function () {
        let res = parse_games("****")
        should.exist(res)
        should(res.length).equal(4)
    })
})