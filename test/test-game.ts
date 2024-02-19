import { suite } from 'uvu';
import assert from 'uvu/assert';
import {parseGame, parseGames, ParseTree} from "../src"
import { TagKeys} from "@mliebelt/pgn-types"

let tag = function (pt: ParseTree, tag: TagKeys): string {
    if (! pt.tags) {
        return ""
    }
    if (pt.tags && pt.tags[tag]) {
        return pt.tags[tag]
    }
    return ""
}

// The following test cases test everything about a game, with the exception of game moves, and tags.
const workingWithOneGame = suite("When working with one game")
workingWithOneGame("should read a complete game inclusive tags", function () {
        let res = parseGame('[White "Me"] [Black "Magnus"] 1. f4 e5 2. g4 Qh4#')
        // console.log(JSON.stringify(res, null, 4))
        assert.ok(res)
        assert.ok(res.tags)
        assert.ok(res.moves)
        assert.is(tag(res, "White"), "Me")
        assert.is(tag(res, "Black"), "Magnus")
        assert.is(res.moves.length, 4)
        assert.ok(res.moves[0])
        assert.is(res.moves[0].notation.notation, "f4")
    })

workingWithOneGame("should read unusual spacing of tags", function () {
        let res = parseGame(' [ White    "Me"   ]  [  Black  "Magnus"   ] 1. e4')
        assert.ok(res)
        assert.ok(res.tags)
        assert.ok(res.moves)
    })

workingWithOneGame("should read tags without notation", function () {
        let res = parseGame('[White "Me"] [Black "Magnus"] *')
        assert.ok(res)
        assert.ok(res.tags)
        assert.ok(res.moves)
        assert.is(res.moves.length, 0)   // end game
        assert.is(tag(res, "White"), "Me")
        assert.is(tag(res, "Black"), "Magnus")
    })

workingWithOneGame("should read moves without tags without game termination marker", function () {
        let res = parseGame("1. f4 e5 2. g4 Qh4#")
        assert.ok(res)
        assert.ok(res.tags)
        assert.ok(res.moves)
        let tags = res.tags ? res.tags : []
        assert.is(Object.keys(tags).length, 0)
        assert.is(res.moves.length, 4)
        assert.ok(res.moves[0])
        assert.is(res.moves[0].notation.notation, "f4")
    })
workingWithOneGame("should read moves without tags with game termination marker ignored", function () {
        let res = parseGame("1. f4 e5 2. g4 Qh4# 0-1")
        assert.ok(res)
        assert.ok(res.tags)
        assert.ok(res.moves)
        // Game result is converted to tag
        let tags = res.tags ? res.tags : []
        assert.is(Object.keys(tags).length, 1)
        assert.is(tag(res,"Result"), "0-1")
        assert.is(res.moves.length, 4)
        assert.ok(res.moves[0])
        assert.is(res.moves[0].notation.notation, "f4")
        //assert.is(res.moves[4], "0-1")
    })
workingWithOneGame("should read comments without moves", function () {
        let res = parseGame("{ [%csl Ya4,Gh8,Be1] } *")
        assert.ok(res)
        assert.ok(res.gameComment)
        assert.ok(res.gameComment?.colorFields)
        assert.is(res.gameComment?.colorFields?.length, 3)
    })
workingWithOneGame.run()

const beingMoreRobust = suite("When reading one game be more robust")
beingMoreRobust("when reading 1 space at the beginning", function () {
        let res = parseGame(" 1. e4")
        assert.ok(res)
        assert.ok(res.moves)
        assert.is(res.moves[0].notation.notation, "e4")
    })

beingMoreRobust("when reading more spaces at the beginning", function () {
        let res = parseGame("  1. e4")
        assert.ok(res)
        assert.ok(res.moves)
        assert.is(res.moves[0].notation.notation, "e4")
    })

beingMoreRobust("when reading game ending", function () {
        let res = parseGame("37. cxb7 Rxh3#{Wunderschön!}")
        assert.ok(res)
        assert.is(res.moves[1].commentAfter, "Wunderschön!")
        res = parseGame("37. cxb7 Rxh3# { Wunderschön!}")
        assert.ok(res)
        assert.is(res.moves[1].commentAfter, " Wunderschön!")
        res = parseGame("37. cxb7 Rxh3# { Wunderschön! } 0-1 ")
        assert.ok(res)
        assert.is(res.moves[1].commentAfter, " Wunderschön! ")
        //assert.is(res.moves[2], "0-1")
    })

beingMoreRobust("should read result including whitespace", function () {
        let res = parseGame("27. Ng2 Qxg2# 0-1 ")
        assert.ok(res)
        //assert.is(res.moves[2], "0-1")
    })
beingMoreRobust.run()

const gameWithComment = suite("When reading a game with gameComment")
gameWithComment ("should read normal comment at the beginning", function () {
        let res = parseGame("{test} 1. e4")
        assert.ok(res)
        assert.ok(res.moves)
        assert.ok(res.gameComment)
        assert.is(res.gameComment?.comment, "test")
    })
gameWithComment ("should read arrows and circles in game comment", function () {
        let res = parseGame("{ [%cal Ye4e8] [%csl Rd4] } 1. e4")
        assert.ok(res)
        assert.ok(res.gameComment)
        let arrows = res.gameComment?.colorArrows || []
        assert.is(arrows.length, 1)
        assert.is(arrows[0], "Ye4e8")
        let fields = res.gameComment?.colorFields || []
        assert.is(fields.length, 1)
        assert.is(fields[0], "Rd4")
    })
gameWithComment ("should read arrows and circles in two game comments", function () {
        let res = parseGame("{ [%cal Ye4e8] } { [%csl Rd4] } 1. e4")
        assert.ok(res)
        assert.ok(res.gameComment)
        let arrows = res.gameComment?.colorArrows || []
        assert.is(arrows.length, 1)
        assert.is(arrows[0], "Ye4e8")
        let fields = res.gameComment?.colorFields || []
        assert.is(fields.length, 1)
        assert.is(fields[0], "Rd4")
    })
gameWithComment ("should read mix of arrows and circles with other comments", function () {
        let res = parseGame("{comment1 [%cal Ye4e8] } {comment2 [%csl Rd4] } 1. e4")
        assert.ok(res)
        assert.ok(res.gameComment)
        let arrows = res.gameComment?.colorArrows || []
        assert.is(arrows.length, 1)
        assert.is(arrows[0], "Ye4e8")
        let fields = res.gameComment?.colorFields || []
        assert.is(fields.length, 1)
        assert.is(fields[0], "Rd4")
        assert.is(res.gameComment?.comment, "comment1 comment2")
    })
gameWithComment.run()

const gameWithIncorrectFormat = suite("When reading games with incorrect format")
gameWithIncorrectFormat("should emmit warnings in games", function () {
        let res = parseGame('[Date "xx"] *')
        assert.ok(res)
        assert.is(res.moves.length, 0)
        assert.is(res.messages.length, 1)
        assert.is(res.messages[0].key, "Date")
        assert.is(res.messages[0].value, "xx")
        assert.is(res.messages[0].message, 'Format of tag: "Date" not correct: "xx"')
    })
gameWithIncorrectFormat.run()

const postProcessing = suite("When doing post processing of one game")
postProcessing("should handle turn correct", function () {
        let res = parseGame('1. e4 e5')
        assert.ok(res)
        assert.is(res.moves.length, 2)
        assert.is(res.moves[0].turn, 'w')
        assert.is(res.moves[1].turn, 'b')
    })
postProcessing("should handle turn correct for variations", function () {
        let res = parseGame('1. e4 e5 (1... d5 2. Nc3)')
        assert.ok(res)
        assert.is(res.moves.length, 2)
        assert.is(res.moves[0].turn, 'w')
        assert.is(res.moves[1].turn, 'b')
        assert.is(res.moves[1].variations[0][0].turn, 'b')
        assert.is(res.moves[1].variations[0][1].turn, 'w')
    })
postProcessing("should handle correct turn for black with FEN given", function () {
        let res = parseGame('[FEN "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"] Nc6 3. d4')
        assert.ok(res)
        assert.is(res.moves.length, 2)
        assert.is(res.moves[0].turn, 'b')
        assert.is(res.moves[1].turn, 'w')
    })
postProcessing("should handle correct turn for white with FEN given", function () {
        let res = parseGame('[FEN "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"] 3. d4 exd4')
        assert.ok(res)
        assert.is(res.moves.length, 2)
        assert.is(res.moves[0].turn, 'w')
        assert.is(res.moves[1].turn, 'b')
    })
postProcessing("should handle correct turn for white with FEN given by option", function () {
        let res = <ParseTree>parseGame('3. d4 exd4',
            { startRule: 'game', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3'})
        assert.ok(res)
        assert.is(res.moves.length, 2)
        assert.is(res.moves[0].turn, 'w')
        assert.is(res.moves[1].turn, 'b')
    })
postProcessing("should handle result both in tags and SAN", function () {
        let res = parseGame('[Result "1-0"] 1. e4 1-0')
        assert.ok(res)
        assert.is(res.moves.length, 1)
        assert.is(tag(res, "Result"), "1-0")
        assert.is(res.messages.length, 0)
    })
postProcessing("should handle result from SAN as tag", function () {
        let res = parseGame('1. e4 1-0')
        assert.ok(res)
        assert.is(res.moves.length, 1)
        assert.is(tag(res, "Result"), "1-0")
        assert.is(res.messages.length, 0)
    })
postProcessing("should handle different result from SAN as tag", function () {
        let res = parseGame('[Result "0-1"] 1. e4 1-0')
        assert.ok(res)
        assert.is(res.moves.length, 1)
        assert.is(tag(res, "Result"), "1-0")
        assert.is(res.messages.length, 1)
        assert.is(res.messages[0].message, "Result in tags is different to result in SAN")
    })
postProcessing.run()

const readingAdditionalNotation = suite("When reading additional notation")
readingAdditionalNotation("should understand a draw offer after a move", function () {
        let res = parseGame('1. e4 e5 2. f4 d4 (=) 3. exd5')
        assert.ok(res)
        assert.is(res.moves.length, 5)
        assert.is(res.moves[3].drawOffer, true)
        assert.is(res.moves[4].drawOffer, undefined)
    })
readingAdditionalNotation ("should understand a draw offer after move with comments after it", function () {
        let res = parseGame('1. e4 e5 2. f4 d4 (=) {Why now???} 3. exd5')
        assert.is(res.moves.length, 5)
        assert.is(res.moves[3].drawOffer, true)
        assert.is(res.moves[3].commentAfter, "Why now???")
    })
readingAdditionalNotation.run()

const readingFailure = suite("When reading failure games")
readingFailure('should handle variants and comments (discussion 271)', function () {
        let res = parseGame('1. e3 h5 ( 1... f6 ) 2. Bc4 d6 3. Bb5+ Qd7 4. h3 f5 5. e4 g5 6. Qxh5+ { test } Kd8 7. Bc4 b6 8. Be6 a5 9. Bxd7 b5 10. Qe8#')
        assert.is(res.moves.length, 19)
    })
readingFailure("should handle BOM on the beginning of games", function () {
        let res = parseGame('\uFEFF[Event ""]\n' +
            '[Setup "1"]\n' +
            '[FEN "4r1k1/1q3ppp/p7/8/Q3r3/8/P4PPP/R3R1K1 w - - 0 1"]\n' +
            '1. Qxe8+ {} Rxe8 2. Rxe8# *\n')
        assert.ok(res)
        assert.is(res.moves.length, 3)
    })
readingFailure.run()


const readingZero = suite("When reading games with error")
