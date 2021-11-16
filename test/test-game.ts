import {parseGame} from "../src/pgn-parser"
import * as should from 'should'
import {ParseTree} from "../src/types";

// The following test cases test everything about a game, with the exception of game moves, and tags.
describe("When working with one game", function () {
    it("should read a complete game inclusive tags", function () {
        let res = parseGame('[White "Me"] [Black "Magnus"] 1. f4 e5 2. g4 Qh4#')
        // console.log(JSON.stringify(res, null, 4))
        should.exist(res)
        should.exist(res.tags)
        should.exist(res.moves)
        should(res.tags["White"]).equal("Me")
        should(res.tags["Black"]).equal("Magnus")
        should(res.moves.length).equal(4)
        should.exist(res.moves[0])
        should(res.moves[0].notation.notation).equal("f4")
    })

    it("should read unusual spacing of tags", function () {
        let res = parseGame(' [ White    "Me"   ]  [  Black  "Magnus"   ] 1. e4')
        should.exist(res)
        should.exist(res.tags)
        should.exist(res.moves)
    })

    it("should read tags without notation", function () {
        let res = parseGame('[White "Me"] [Black "Magnus"] *')
        should.exist(res)
        should.exist(res.tags)
        should.exist(res.moves)
        should(res.moves.length).equal(0)   // end game
        should(res.tags["White"]).equal("Me")
        should(res.tags["Black"]).equal("Magnus")
    })

    it("should read moves without tags without game termination marker", function () {
        let res = parseGame("1. f4 e5 2. g4 Qh4#")
        should.exist(res)
        should.exist(res.tags)
        should.exist(res.moves)
        should(Object.keys(res.tags).length).equal(0)
        should(res.moves.length).equal(4)
        should.exist(res.moves[0])
        should(res.moves[0].notation.notation).equal("f4")
    })
    it("should read moves without tags with game termination marker ignored", function () {
        let res = parseGame("1. f4 e5 2. g4 Qh4# 0-1")
        should.exist(res)
        should.exist(res.tags)
        should.exist(res.moves)
        // Game result is converted to tag
        should(Object.keys(res.tags).length).equal(1)
        should(res.tags["Result"]).equal("0-1")
        should(res.moves.length).equal(4)
        should.exist(res.moves[0])
        should(res.moves[0].notation.notation).equal("f4")
        //should(res.moves[4]).equal("0-1")
    })
    it("should read comments without moves", function () {
        let res = parseGame("{ [%csl Ya4,Gh8,Be1] } *")
        should.exist(res)
        should.exist(res.gameComment)
        should.exist(res.gameComment.colorFields)
        should(res.gameComment.colorFields.length).equal(3)
    })
})

describe("When reading one game be more robust", function () {
    it("when reading 1 space at the beginning", function () {
        let res = parseGame(" 1. e4")
        should.exist(res)
        should.exist(res.moves)
        should(res.moves[0].notation.notation).equal("e4")
    })

    it("when reading more spaces at the beginning", function () {
        let res = parseGame("  1. e4")
        should.exist(res)
        should.exist(res.moves)
        should(res.moves[0].notation.notation).equal("e4")
    })

    it("when reading game ending", function () {
        let res = parseGame("37. cxb7 Rxh3#{Wunderschön!}")
        should.exist(res)
        should(res.moves[1].commentAfter).equal("Wunderschön!")
        res = parseGame("37. cxb7 Rxh3# { Wunderschön!}")
        should.exist(res)
        should(res.moves[1].commentAfter).equal(" Wunderschön!")
        res = parseGame("37. cxb7 Rxh3# { Wunderschön! } 0-1 ")
        should.exist(res)
        should(res.moves[1].commentAfter).equal(" Wunderschön! ")
        //should(res.moves[2]).equal("0-1")
    })

    it("should read result including whitespace", function () {
        let res = parseGame("27. Ng2 Qxg2# 0-1 ")
        should.exist(res)
        //should(res.moves[2]).equal("0-1")
    })
})

describe("When reading a game with gameComment", function () {
    it ("should read normal comment at the beginning", function () {
        let res = parseGame("{test} 1. e4")
        should.exist(res)
        should.exist(res.moves)
        should.exist(res.gameComment)
        should(res.gameComment.comment).equal("test")
    })
    it ("should read arrows and circles in game comment", function () {
        let res = parseGame("{ [%cal Ye4e8] [%csl Rd4] } 1. e4")
        should.exist(res)
        should.exist(res.gameComment)
        should(res.gameComment.colorArrows.length).equal(1)
        should(res.gameComment.colorArrows[0]).equal("Ye4e8")
        should(res.gameComment.colorFields.length).equal(1)
        should(res.gameComment.colorFields[0]).equal("Rd4")
    })
    it ("should read arrows and circles in two game comments", function () {
        let res = parseGame("{ [%cal Ye4e8] } { [%csl Rd4] } 1. e4")
        should.exist(res)
        should.exist(res.gameComment)
        should(res.gameComment.colorArrows.length).equal(1)
        should(res.gameComment.colorArrows[0]).equal("Ye4e8")
        should(res.gameComment.colorFields.length).equal(1)
        should(res.gameComment.colorFields[0]).equal("Rd4")
    })
    it ("should read mix of arrows and circles with other comments", function () {
        let res = parseGame("{comment1 [%cal Ye4e8] } {comment2 [%csl Rd4] } 1. e4")
        should.exist(res)
        should.exist(res.gameComment)
        should(res.gameComment.colorArrows.length).equal(1)
        should(res.gameComment.colorArrows[0]).equal("Ye4e8")
        should(res.gameComment.colorFields.length).equal(1)
        should(res.gameComment.colorFields[0]).equal("Rd4")
        should(res.gameComment.comment).equal("comment1 comment2")
    })
})

describe("When reading games with incorrect format", function () {
    it("should emmit warnings in games", function () {
        let res = parseGame('[Date "xx"] *')
        should.exist(res)
        should(res.moves.length).equal(0)
        should(res.messages.length).equal(1)
        should(res.messages[0].key).equal("Date")
        should(res.messages[0].value).equal("xx")
        should(res.messages[0].message).equal('Format of tag: "Date" not correct: "xx"')
    })
})

describe("When doing post processing of one game", function () {
    it("should handle turn correct", function () {
        let res = parseGame('1. e4 e5')
        should.exist(res)
        should(res.moves.length).equal(2)
        should(res.moves[0].turn).equal('w')
        should(res.moves[1].turn).equal('b')
    })
    it("should handle turn correct for variations", function () {
        let res = parseGame('1. e4 e5 (1... d5 2. Nc3)')
        should.exist(res)
        should(res.moves.length).equal(2)
        should(res.moves[0].turn).equal('w')
        should(res.moves[1].turn).equal('b')
        should(res.moves[1].variations[0][0].turn).equal('b')
        should(res.moves[1].variations[0][1].turn).equal('w')
    })
    it("should handle correct turn for black with FEN given", function () {
        let res = parseGame('[FEN "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"] Nc6 3. d4')
        should.exist(res)
        should(res.moves.length).equal(2)
        should(res.moves[0].turn).equal('b')
        should(res.moves[1].turn).equal('w')
    })
    it("should handle correct turn for white with FEN given", function () {
        let res = parseGame('[FEN "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"] 3. d4 exd4')
        should.exist(res)
        should(res.moves.length).equal(2)
        should(res.moves[0].turn).equal('w')
        should(res.moves[1].turn).equal('b')
    })
    it("should handle correct turn for white with FEN given by option", function () {
        let res = <ParseTree>parseGame('3. d4 exd4',
            { startRule: 'game', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3'})
        should.exist(res)
        should(res.moves.length).equal(2)
        should(res.moves[0].turn).equal('w')
        should(res.moves[1].turn).equal('b')
    })
})
