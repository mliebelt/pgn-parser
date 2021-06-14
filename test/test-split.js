let parser = require("../split-games.js");

let should = require('should');
let fs = require('fs');

function split_games(string) {
    return parser.split(string, {startRule: "games"})
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
})
