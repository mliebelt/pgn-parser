import { test, suite } from 'uvu';
import assert from 'uvu/assert';
import {parseGame, ParseTree} from "../src"
import { split, SplitGame } from "../src"
import { normalizeLineEndings } from "../src/split-games"
import fs from 'fs'
import { Tags } from "@mliebelt/pgn-types";

function splitGames(string: string):SplitGame[] {
    return split(string, {startRule: "games"})
}

const xtest = (exampleSkippedTest: string, p: () => void) => {};

const shouldAbleToSplitOneGame = suite("Should be able to split one game");

// The following test cannot be done in the Github action runner, the test data is huge: 34 MB
// But it helps to be able to test that locally. The function xtest is like xit in Mocha.
// shouldAbleToSplitOneGame("should be much faster than parsing them completely", function (done) {
xtest("should be much faster than parsing them completely", function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject('Test took too long'), 15000);
        fs.readFile(process.cwd() + '/test/pgn/BenkoGambit.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = splitGames(data)
            assert.is(res.length,52966)
            resolve()
        })
})})
// shouldAbleToSplitOneGame("should split all games: 2885", function () {
xtest("should split all games: 2885", function () {
    fs.readFile(process.cwd() + '/test/pgn/twic-02-2885games.pgn', 'utf8', function (err, data) {
        if (err) { throw err}
        let res = splitGames(data)
        assert.is(res.length,2885)
    })
})
shouldAbleToSplitOneGame('split into tags and pgn', () => {
    let res = splitGames("*")
    assert.ok(res)
    assert.is(res.length, 1)
});
shouldAbleToSplitOneGame('with some content in both sections', () => {
    let res = splitGames('[Event "My Event"]\n\n1. e4 e5 *')
    assert.ok(res)
    assert.is(res.length, 1)
});
shouldAbleToSplitOneGame('with some content in both sections with additional newlines', () => {
    let res = splitGames('[Event "My Event"]\n\n\n\n1. e4 e5 *')
    assert.ok(res)
});

shouldAbleToSplitOneGame.run();

const whenReadingManyGames = suite("When reading many games and split them");

whenReadingManyGames('should split all games: 32', (done) => {
    fs.readFile(process.cwd() + '/test/pgn/32games.pgn', 'utf8', function (err, data) {
        if (err) { throw err }
        let res = splitGames(data)
        assert.is(res.length, 32)
    })
});
whenReadingManyGames('should split all games: 232', (done) => {
    fs.readFile(process.cwd() + '/test/pgn/twic-01-232games.pgn', 'utf8', function (err, data) {
        if (err) { throw err }
        let res = splitGames(data)
        assert.is(res.length, 232)
    })
});
whenReadingManyGames('be able to filter games depending on tags', (done) => {
    fs.readFile(process.cwd() + '/test/pgn/32games.pgn', 'utf8', function (err, data) {
        if (err) { throw err }
        let res = splitGames(data)
        let found: ParseTree[] = []
        res.forEach(function (game) {
            let tags = parseGame(game.tags, {startRule: "tags"}).tags
            if (tags?.Result == "1-0") {
                found.push(parseGame(game.all))
            }
        })
        assert.is(found.length, 22)
    })
});
whenReadingManyGames('should be able to print out players', (done) => {
    fs.readFile(process.cwd() + '/test/pgn/32games.pgn', 'utf8', function (err, data) {
        if (err) { throw err }
        let res = splitGames(data)
        let players: string[] = []
        res.forEach(function (game) {
            let tags = parseGame(game.tags, {startRule: 'tags'}).tags as Tags
            players.push(tags["White"])
            players.push(tags["Black"])
        })
        // @ts-ignore
        let unique = [...new Set(players)]
        assert.is(unique.length, 38)
    })
});
whenReadingManyGames("should split games with clock annotations", () => {
    let games = `1. e4 {[%clk 23:59:57]} 1... c5 {[%clk 23:59:49]}  0-1

1. e4 {[%clk 23:59:51]} 1... c5 {[%clk 23:59:15]} 1-0
`
        let res = splitGames(games)
        assert.ok(res)
        assert.is(res.length,2)
    })
whenReadingManyGames("#462 handle additional newlines in game", function (done) {
    fs.readFile(process.cwd() + '/test/pgn/lichess_mliebelt_2024-01-03.pgn', 'utf8', function (err, data) {
        if (err) {
            throw err
        }
        let res = splitGames(data)
        assert.ok(res)
        assert.is(res.length,8)
    })
})

whenReadingManyGames.run();

const whenNormalizingLineEndings = suite("When normalizing line endings");

whenNormalizingLineEndings('should handle multiple empty lines', () => {
    let res = normalizeLineEndings('a\n\n\n\n\n\nb')
    assert.ok(res)
    assert.is(res.length, 8)
});

whenNormalizingLineEndings("should handle the line end convention of windows as well", function () {
    let res = normalizeLineEndings('a\r\n\r\n\r\n\r\n\r\n\r\nb')
    assert.ok(res)
    assert.is(res.length,8)
    assert.is(res[1],'\n')
})

whenNormalizingLineEndings.run();