import { suite } from 'uvu';
import assert from 'uvu/assert';
import {parseGames} from "../src"

const readingZero = suite("When reading 0 games")
    readingZero("should read 0 games from empty string", function () {
        let res = parseGames("")
        assert.ok(res)
        assert.is(res.length, 0)
    })
readingZero("should read 0 games with whitespace", function () {
        let res = parseGames("\n\n")
        assert.ok(res)
        assert.is(res.length, 0)
    })
readingZero.run()

const readingOne = suite("When reading 1 game")
readingOne("should read exactly one game", function () {
        let res = parseGames('[White "Me"] [Black "Magnus"] 1. f4 e5 2. g4 Qh4#')
        assert.ok(res)
        assert.is(res.length, 1)
    })
readingOne("should ignore whitespace before, in between and after that one game", function () {
        let res = parseGames('  [White "Me"] \t\n[Black "Magnus"] \t\t1. f4 e5 2. g4 Qh4#\n\n')
        assert.ok(res)
        assert.is(res.length, 1)
    })
readingOne("should understand the minimal game ever", function () {
        let res = parseGames('*')
        assert.ok(res)
        assert.is(res.length, 1)
    })
readingOne.run()

// For more examples how to read many games, see the tests in `test-time.js`.
const readingMore = suite("When reading more than 1 game")
readingMore("should read 2 games without whitespace in between", function () {
        let input = '[UTCDate "2021.03.08"] [UTCTime "10:30:52"] [Variant "Standard"] [ECO "C57"] [Opening "Italian Game: Two Knights Defense, Fried Liver Attack"] [Annotator ""] 1. e4 e5 *\n[Event "name2"] [Site ""] [Result "*"] [UTCDate "2021.03.08"] [UTCTime "10:30:52"] [Variant "Standard"] [ECO "C57"] [Opening "Italian Game: Two Knights Defense, Fried Liver Attack"] [Annotator ""] 1. e4 e5 *'
        let res = parseGames(input)
        assert.ok(res)
    })
readingMore ("should read all combinations of games, with and without whitespace in between", function () {
        let res = parseGames('[White "Me"] *[White "Me"]1. e4 e5 * ')
        assert.ok(res)
        assert.is(res.length, 2)
    })
    // The following is wrong, and will be corrected in ticket #44.
readingMore("should understand 3 minimal games (parsed wrong, see #44)", function () {
        let res = parseGames('*1. e4 e5 1-0 1. e4 *')
        assert.ok(res)
        assert.is(res.length, 3)
    })
readingMore ("should understand 2 normal games, with linefeeds in between (parsed wrong, see #44)", function () {
        let res = parseGames("1. e4 *\n\n1. d4")
        assert.ok(res)
        assert.is(res.length, 2)
    })
readingMore ("should understand 2 normal games, with variants, with linefeeds in between (parsed wrong, see #44)", function () {
        let res = parseGames("1. e4 *\n\n1. d4 d5 (1... e5)")
        assert.ok(res)
        assert.is(res.length, 2)
    })
readingMore ("should understand 2 normal games with tags, with linefeeds in between", function () {
        let res = parseGames("[White \"Me\"]1. e4 *\n\n[Black \"You\"]1. d4")
        assert.ok(res)
        assert.is(res.length, 2)
    })
readingMore ("should understand 2 normal games with last game with tags, with linefeeds in between", function () {
        let res = parseGames("1. e4 *\n\n[Black \"You\"]1. d4")
        assert.ok(res)
        assert.is(res.length, 2)
    })
readingMore ("should understand 2 games with last game only comment and moves (parsed wrong, see #44)", function () {
        let res = parseGames("1. e4 e5 * { comment } 1. d4 d5 *")
        assert.ok(res)
        assert.is(res.length, 2)
    })
readingMore ("should understand 2 games with last game tags, comment and moves", function () {
        let res = parseGames("1. e4 e5 * [White \"Me\"] { comment } 1. d4 d5 *")
        assert.ok(res)
        assert.is(res.length, 2)
    })
readingMore ("should ignore whitespace before and after games", function () {
        let res = parseGames("\n\n1. e4 * \n\n[White \"Me\"] *  ")
        assert.ok(res)
        assert.is(res.length, 2)
    })
readingMore ("should read 4 minimal games (not obvious)", function () {
        let res = parseGames("****")
        assert.ok(res)
        assert.is(res.length, 4)
    })
readingMore.run()

const postProcessing = suite("When doing post processing of many games")
postProcessing("should handle turn correct", function () {
        let res = parseGames('1. e4 e5 * [FEN "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"] d4 exd5 *')
        assert.ok(res)
        assert.is(res.length, 2)
        assert.is(res[0].moves[0].turn, 'w')
        assert.is(res[0].moves[1].turn, 'b')
        assert.is(res[1].moves[0].turn, 'b')
        assert.is(res[1].moves[1].turn, 'w')
    })
postProcessing.run()

const readingError = suite("When reading games with error")
readingError("should handle BOM on the beginning of games", function () {
        let res = parseGames('\uFEFF[Event ""]\n' +
            '[Setup "1"]\n' +
            '[FEN "4r1k1/1q3ppp/p7/8/Q3r3/8/P4PPP/R3R1K1 w - - 0 1"]\n' +
            '1. Qxe8+ {} Rxe8 2. Rxe8# *\n')
        assert.ok(res)
        assert.is(res.length, 1)
    })
readingError.run()