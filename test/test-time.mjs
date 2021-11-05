import pkg from "../lib/pgn-parser.js"
const {parse} = pkg
import should from "should"
import fs from 'fs'
import https from 'https'

/**
 * The following tests are only interesting in the following perspective:
 * <ul>
 *     <li>Is the number of games the correct one?</li>
 *     <li>Is the time comparable to the last times when the tests were executed?</li>
 * </ul>
 *
 * I had first problems to write those tests, and then found the following issue:
 * https://github.com/mochajs/mocha/issues/1691 which references https://mochajs.org/#asynchronous-code
 *
 * This explains in detail why and how to use the done function provided by mocha.
 * Be aware, that the bigger game files `twic-02-2885games.pgn` and `twic1333-9072games.pgn` are ~10MB.
 * I wanted to avoid those, and have therefore not committed and pushed them. The tests are only done
 * locally on my computer, to check if bigger files work sufficient well (which works).
 */
describe("When reading many games", function () {
    it("should read the correct number: 32", function (done) {
        fs.readFile(process.cwd() + '/test/pgn/32games.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = parse(data, {startRule: "games"})
            should(res.length).equal(32)
            done()
        })
    })
    it("should read the correct number: 232", function (done) {
        fs.readFile(process.cwd() + '/test/pgn/twic-01-232games.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = parse(data, { startRule: "games" } )
            should(res.length).equal(232)
            done()
        })
    })
    it("should read the correct number: 1", function (done) {
        fs.readFile(process.cwd() + '/test/pgn/benko.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = parse(data, { startRule: "games" } )
            should(res.length).equal(2)
            done()
        })
    })
    // I have kept that bigger file only locally so the test will not run in Github actions
    xit("should read the correct number of games: 2885", function (done) {
        fs.readFile(process.cwd() + '/test/pgn/twic-02-2885games.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = parse(data, { startRule: "games" } )
            should(res.length).equal(2885)
            done()
        })
    })
    // Same here, file is even bigger
    xit("should read the correct number of games: 9072", function (done) {
        this.timeout(15000);
        fs.readFile(process.cwd() + '/test/pgn/twic1333-9072games.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = parse(data, { startRule: "games" } )
            should(res.length).equal(9072)
            done()
        })
    })
    xit("should read the correct number of games: 52966", function (done) {
        this.timeout(15000);
        fs.readFile(process.cwd() + '/test/pgn/BenkoGambit.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = parse(data, { startRule: "games" } )
            should(res.length).equal(52966)
            done()
        })
    })
})

// For this to work, you have to have something that is publicly available, and not only locally on that server.
// For that purpose, I created a gist, and that worked. The critical problem here is how to retrieve something
// from a public site, like chessgames.com. The database files that can be found at https://database.lichess.org/ are
// 2 orders of magnitude (at least) too big.
describe("When reading games from the internet", function () {
    it("should be possible to parse them as well",function (done) {
        /// <script src="https://gist.github.com/mliebelt/d8f2fd9228916df4de0f09a22be4ed46.js"></script>
        // https://gist.github.com/mliebelt/d8f2fd9228916df4de0f09a22be4ed46
        https.get('https://gist.githubusercontent.com/mliebelt/d8f2fd9228916df4de0f09a22be4ed46/raw/d9479e1c35aa926e363504971bb96890d4abf648/2-games.pgn', (res) => {
            // res.setEncoding('utf8')
            let data = ''
            res.on('data', (chunk) => { data += chunk })
            res.on('end', () => {
                let res = parse(data, { startRule: "games" } )
                should(res.length).equal(2)
                done()
            })
        })
    })
})

