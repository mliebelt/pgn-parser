let parser = require("../pgn-parser.js");

let should = require('should');

function parse_game(string) {
    return parser.parse(string, {startRule: "game"})
}

function parse_games(string) {
    return parser.parse(string, {startRule: "games"})
}

describe("When working with games", function () {
    it("should read a complete game inclusive tags", function () {
        let res = parse_game('[White "Me"] [Black "Magnus"] 1. f4 e5 2. g4 Qh4#')
        should.exist(res)
        should.exist(res.tags)
        should.exist(res.moves)
        should(res.tags["White"]).equal("Me")
        should(res.tags["Black"]).equal("Magnus")
        should(res.moves.length).equal(4)
        should.exist(res.moves[0])
        should(res.moves[0].notation.notation).equal("f4")
    })

    it("should read tags without notation", function () {
        let res = parse_game('[White "Me"] [Black "Magnus"]')
        should.exist(res)
        should.exist(res.tags)
        should.exist(res.moves)
        should(res.moves.length).equal(0)
        should(res.tags["White"]).equal("Me")
        should(res.tags["Black"]).equal("Magnus")
    })

    it("should read moves without tags", function () {
        let res = parse_game("1. f4 e5 2. g4 Qh4#")
        should.exist(res)
        should.exist(res.tags)
        should.exist(res.moves)
        should(Object.keys(res.tags).length).equal(0)
        should(res.moves.length).equal(4)
        should.exist(res.moves[0])
        should(res.moves[0].notation.notation).equal("f4")
    })
})

describe("When reading games be more robust", function () {
    it("when reading 1 space at the beginning", function () {
        let res = parse_game(" 1. e4")
        should.exist(res)
        should.exist(res.moves)
    })

    it("when reading more spaces at the beginning", function () {
        let res = parse_game("  1. e4")
        should.exist(res)
        should.exist(res.moves)
    })

    it("when reading many games", function () {
        let res = parse_games("  1. e4")
        should.exist(res)
        should.exist(res[0])
    })

    it("when reading game ending", function () {
        let res = parse_game("37. cxb7 Rxh3#{ Wunderschön!}")
        should.exist(res)
        res = parse_game("37. cxb7 Rxh3# { Wunderschön!}")
        should.exist(res)
        res = parse_game("37. cxb7 Rxh3# { Wunderschön! }  ")
        should.exist(res)
    })

    it("should read result including whitespace", function () {
        let res = parse_game("27. Ng2 Qxg2# 0-1 ")
        should.exist(res)
    })
})

describe("When reading a game with gameComment", function () {
    it ("should read normal comment at the beginning", function () {
        let res = parse_game("{test} 1. e4")
        should.exist(res)
        should.exist(res.moves)
        should.exist(res.gameComment)
        should(res.gameComment.comment).equal("test")
    })
    it ("should read arrows and circles in game comment", function () {
        let res = parse_game("{ [%cal Ye4e8] [%csl Rd4] } 1. e4")
        should.exist(res)
        should.exist(res.gameComment)
        should(res.gameComment.colorArrows.length).equal(1)
        should(res.gameComment.colorArrows[0]).equal("Ye4e8")
        should(res.gameComment.colorFields.length).equal(1)
        should(res.gameComment.colorFields[0]).equal("Rd4")
    })
    it ("should read arrows and circles in two game comments", function () {
        let res = parse_game("{ [%cal Ye4e8] } { [%csl Rd4] } 1. e4")
        should.exist(res)
        should.exist(res.gameComment)
        should(res.gameComment.colorArrows.length).equal(1)
        should(res.gameComment.colorArrows[0]).equal("Ye4e8")
        should(res.gameComment.colorFields.length).equal(1)
        should(res.gameComment.colorFields[0]).equal("Rd4")
    })
    it ("should read mix of arrows and circles with other comments comments", function () {
        let res = parse_game("{comment1 [%cal Ye4e8] } {comment2 [%csl Rd4] } 1. e4")
        should.exist(res)
        should.exist(res.gameComment)
        should(res.gameComment.colorArrows.length).equal(1)
        should(res.gameComment.colorArrows[0]).equal("Ye4e8")
        should(res.gameComment.colorFields.length).equal(1)
        should(res.gameComment.colorFields[0]).equal("Rd4")
        should(res.gameComment.comment).equal("comment1 comment2")
    })
})