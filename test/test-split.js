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
    // The pgn file is 33MB big, so I don't want it to be part of the library. It contains 52966 games, split in 315 ms.
    xit("should be much faster than parsing them completely", function (done) {
        this.timeout(15000);
        fs.readFile(process.cwd() + '/test/pgn/BenkoGambit.pgn', 'utf8', function (err, data) {
            if (err) { throw err }
            let res = split_games(data)
            should(res.length).equal(52966)
            done()
        })
    })
    xit("should split all games: 2885", function () {
        fs.readFile(process.cwd() + '/test/pgn/twic-02-2885games.pgn', 'utf8', function (err, data) {
            if (err) { throw err}
            let res = split_games(data)
            should(res.length).equal(2885)
        })
    })
    it("should split all games: 32", function () {
        fs.readFile(process.cwd() + '/test/pgn/32games.pgn', 'utf8', function (err, data) {
            if (err) { throw err}
            let res = split_games(data)
            should(res.length).equal(32)
        })
    })
    it("should split all games: 232", function () {
        fs.readFile(process.cwd() + '/test/pgn/twic-01-232games.pgn', 'utf8', function (err, data) {
            if (err) { throw err}
            let res = split_games(data)
            should(res.length).equal(232)
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
    it("should split games with clock annotations", function () {
        let games = `[Event "Let's Play!"]
[Site "Chess.com"]
[Date "2021.06.07"]
[Round "-"]
[White "hvnqk"]
[Black "michaelleehobbs"]
[Result "0-1"]
[CurrentPosition "r3r1k1/3nQpp1/pq1p1n1p/3P1P2/1p1p4/1P3B2/P1P1R1PP/R6K w - - 8 24"]
[Timezone "UTC"]
[ECO "B86"]
[ECOUrl "https://www.chess.com/openings/Sicilian-Defense-Open-Scheveningen-Sozin-Attack-6...a6"]
[UTCDate "2021.06.07"]
[UTCTime "22:02:15"]
[WhiteElo "1355"]
[BlackElo "1290"]
[TimeControl "1/86400"]
[Termination "michaelleehobbs won by resignation"]
[StartTime "22:02:15"]
[EndDate "2021.06.13"]
[EndTime "23:20:17"]
[Link "https://www.chess.com/game/daily/338791045"]
[UUID "a3eaa6ea-982d-4cb8-8f25-2b43cfcda3cd"]

1. e4 {[%clk 23:59:57]} 1... c5 {[%clk 23:59:49]} 2. Nf3 {[%clk 23:57:09]} 2... d6 {[%clk 23:57:15]} 3. d4 {[%clk 15:35:11]} 3... cxd4 {[%clk 9:06:39]} 4. Nxd4 {[%clk 23:48:03]} 4... Nf6 {[%clk 23:40:54]} 5. Nc3 {[%clk 23:59:40]} 5... a6 {[%clk 23:55:16]} 6. Bc4 {[%clk 18:00:46]} 6... e6 {[%clk 16:25:24]} 7. O-O {[%clk 23:51:11]} 7... b5 {[%clk 23:39:33]} 8. Bd3 {[%clk 23:20:09]} 8... Bb7 {[%clk 15:43:13]} 9. Bg5 {[%clk 23:47:23]} 9... Be7 {[%clk 23:31:28]} 10. f4 {[%clk 23:56:44]} 10... h6 {[%clk 23:56:56]} 11. Bh4 {[%clk 14:31:26]} 11... Nh7 {[%clk 8:48:36]} 12. Bxe7 {[%clk 16:22:03]} 12... Kxe7 {[%clk 12:43:38]} 13. f5 {[%clk 23:33:19]} 13... Qb6 {[%clk 23:47:21]} 14. Be2 {[%clk 23:36:59]} 14... e5 {[%clk 23:09:26]} 15. Nd5+ {[%clk 23:45:02]} 15... Bxd5 {[%clk 23:58:17]} 16. exd5 {[%clk 22:19:23]} 16... exd4 {[%clk 23:54:20]} 17. Kh1 {[%clk 23:43:39]} 17... Nf6 {[%clk 23:24:01]} 18. Bf3 {[%clk 23:58:13]} 18... Rc8 {[%clk 23:44:35]} 19. b3 {[%clk 14:54:53]} 19... b4 {[%clk 14:40:23]} 20. Qe2+ {[%clk 21:32:47]} 20... Kf8 {[%clk 21:46:27]} 21. Rfe1 {[%clk 22:10:34]} 21... Nbd7 {[%clk 23:31:31]} 22. Qe7+ {[%clk 5:29:15]} 22... Kg8 {[%clk 23:46:40]} 23. Re2 {[%clk 20:02:36]} 23... Re8 {[%clk 23:32:24]} 0-1

[Event "Let's Play!"]
[Site "Chess.com"]
[Date "2021.06.05"]
[Round "-"]
[White "Sl1ckChess"]
[Black "michaelleehobbs"]
[Result "1-0"]
[CurrentPosition "4r2r/6R1/p1R1kp2/3np3/4P2p/5NbP/PPP3P1/1K6 b - - 1 37"]
[Timezone "UTC"]
[ECO "B60"]
[ECOUrl "https://www.chess.com/openings/Sicilian-Defense-Open-Classical-Richter-Rauzer-Variation-6...Qb6"]
[UTCDate "2021.06.05"]
[UTCTime "23:05:08"]
[WhiteElo "1357"]
[BlackElo "1281"]
[TimeControl "1/86400"]
[Termination "Sl1ckChess won by checkmate"]
[StartTime "23:05:08"]
[EndDate "2021.06.13"]
[EndTime "20:00:21"]
[Link "https://www.chess.com/game/daily/338416961"]
[UUID "b7f4ecb8-395c-428c-add7-683c34b2f98c"]

1. e4 {[%clk 23:59:51]} 1... c5 {[%clk 23:59:15]} 2. Nf3 {[%clk 23:30:17]} 2... d6 {[%clk 23:44:50]} 3. d4 {[%clk 23:59:30]} 3... cxd4 {[%clk 23:57:12]} 4. Nxd4 {[%clk 22:52:13]} 4... Nf6 {[%clk 5:16:27]} 5. Nc3 {[%clk 23:59:46]} 5... Nc6 {[%clk 23:22:22]} 6. Bg5 {[%clk 17:58:05]} 6... Qb6 {[%clk 14:58:13]} 7. Nb3 {[%clk 22:46:36]} 7... e6 {[%clk 15:48:08]} 8. Bxf6 {[%clk 23:55:08]} 8... gxf6 {[%clk 23:26:26]} 9. Qd2 {[%clk 23:53:24]} 9... a6 {[%clk 23:45:54]} 10. f4 {[%clk 22:22:32]} 10... h5 {[%clk 23:41:35]} 11. Be2 {[%clk 22:30:43]} 11... Qc7 {[%clk 23:56:45]} 12. O-O-O {[%clk 23:36:59]} 12... e5 {[%clk 21:21:00]} 13. Nd5 {[%clk 2:30:21]} 13... Qd8 {[%clk 23:52:12]} 14. fxe5 {[%clk 23:20:23]} 14... fxe5 {[%clk 15:08:42]} 15. Rhf1 {[%clk 22:02:45]} 15... Bh6 {[%clk 16:15:09]} 16. Ne3 {[%clk 18:14:24]} 16... Be6 {[%clk 4:38:56]} 17. Kb1 {[%clk 21:12:58]} 17... Qg5 {[%clk 23:53:26]} 18. Rf3 {[%clk 23:57:32]} 18... Bg4 {[%clk 7:39:08]} 19. Rg3 {[%clk 14:52:48]} 19... h4 {[%clk 9:42:18]} 20. Rxg4 {[%clk 23:16:02]} 20... Qxe3 {[%clk 23:33:54]} 21. Qxe3 {[%clk 23:39:57]} 21... Bxe3 {[%clk 23:40:21]} 22. Rxd6 {[%clk 23:59:21]} 22... Ke7 {[%clk 23:55:58]} 23. Rd3 {[%clk 23:33:03]} 23... Bg1 {[%clk 21:46:49]} 24. h3 {[%clk 23:45:07]} 24... Bh2 {[%clk 23:55:04]} 25. Nd2 {[%clk 23:23:00]} 25... Ke6 {[%clk 23:54:21]} 26. Nf3 {[%clk 21:19:13]} 26... Bg3 {[%clk 23:58:37]} 27. Rc3 {[%clk 19:23:51]} 27... Kd7 {[%clk 13:00:05]} 28. Bc4 {[%clk 23:43:58]} 28... f6 {[%clk 23:33:40]} 29. Rd3+ {[%clk 23:27:59]} 29... Kc7 {[%clk 23:58:16]} 30. Rg7+ {[%clk 23:57:28]} 30... Kb6 {[%clk 23:58:43]} 31. Rb3+ {[%clk 23:58:21]} 31... Kc5 {[%clk 23:57:24]} 32. Bd5 {[%clk 23:57:14]} 32... Nb4 {[%clk 23:47:45]} 33. Rc3+ {[%clk 23:37:38]} 33... Kd6 {[%clk 23:57:09]} 34. Bxb7 {[%clk 23:50:32]} 34... Rae8 {[%clk 23:49:01]} 35. Rcc7 {[%clk 23:40:58]} 35... Ke6 {[%clk 23:54:11]} 36. Bd5+ {[%clk 23:55:49]} 36... Nxd5 {[%clk 23:55:26]} 37. Rc6# {[%clk 23:54:19]} 1-0
`
        let res = split_games(games)
        should.exist(res)
        should(res.length).equal(2)
    })
})
