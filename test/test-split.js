let splitter = require("../split-games.js")
let parser = require("../pgn-parser")

let should = require('should')
let fs = require('fs')

function split_games(string) {
    return splitter.split(string, {startRule: "games"})
}

describe("Should able to split one game", function () {
    it("split it into tags and pgn", function () {
        let res = split_games("*")
        should.exist(res)
    })

    it ("with some content in both sections", function () {
        let res = split_games('[Event "My Event"] 1. e4 e5 *')
        should.exist(res)
    })
})

describe("When reading many games and split them", function () {
    xit("should be much faster than parsing them completely", function (done) {
        this.timeout(15000);
        fs.readFile(process.cwd() + '/test/pgn/BenkoGambit.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = split_games(data)
            should(res.length).equal(52966)
            done()
        })
    })
    it("be able to filter games depending on tags", function (done) {
        fs.readFile(process.cwd() + '/test/pgn/32games.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = split_games(data)
            let found = []
            res.forEach(function (game) {
                let tags = parser.parse(game.tags, {startRule: "tags"})
                if (tags.Result == "1-0") {
                    found.push(parser.parse(game.all, {startRule: "game"}))
                }
            })
            should(found.length).equal(22)
            done()
        })
    })
    it("should be able to print out players", function (done) {
        fs.readFile(process.cwd() + '/test/pgn/32games.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = split_games(data)
            let players = []
            res.forEach(function (game) {
                let tags = parser.parse(game.tags, {startRule: 'tags'})
                players.push(tags.White)
                players.push(tags.Black)
            })
            let unique = [...new Set(players)]
            should(unique.length).equal(38)
            done()
        })
    })
})
