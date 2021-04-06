var parser = require("../pgn-parser.js");

var should = require('should');

function parse_tags(string) {
    return parser.parse(string, { startRule: "tags" })
}

describe("When working with all kind of tags", function () {
    it("should read one tag", function () {
        let res = parse_tags('[White "Me"]')
        should(Object.keys(res).length).equal(1)
    })
    it("should read all 7 rooster tags", function () {
        let res = parse_tags('[Event "What a tournament"] [Site "My home town"] [Date "2020.05.16"] ' +
            '[Round "1"] [White "Me"] [Black "Magnus"] [Result "1-0"][WhiteTitle "GM"]')
        should(res.Event).equal("What a tournament")
        should(res.Site).equal("My home town")
        should(res.Round).equal("1")
        should(res.White).equal("Me")
        should(res.Black).equal("Magnus")
        should(res.Result).equal("1-0")
        should(res.Date.value).equal("2020.05.16")
    })
    it("should read all optional player related", function () {
        let res = parse_tags(
            '[WhiteTitle "GM"] [BlackTitle "IM"] ' +
            '[WhiteELO "2899"] [BlackELO "700"] [WhiteUSCF "1234"] [BlackUSCF "1234"] [WhiteNA "m.c@norway.com"]' +
            '[BlackNA "me@world.org"] [WhiteType "Human"] [BlackType "Computer"]')
        should(res.WhiteTitle).equal("GM")
        should(res.BlackTitle).equal("IM")
        should(res.WhiteELO).equal(2899)
        should(res.BlackELO).equal(700)
        should(res.WhiteUSCF).equal(1234)
        should(res.BlackUSCF).equal(1234)
        should(res.WhiteNA).equal("m.c@norway.com")
        should(res.BlackNA).equal("me@world.org")
        should(res.WhiteType).equal("Human")
        should(res.BlackType).equal("Computer")
    })
    it("should read all event related information", function () {
        let res = parse_tags('[EventDate "2020.05.02"] [EventSponsor "USCF"] [Section "A"] ' +
            '[Stage "Final"] [Board "1"]')
        should(res.EventDate.value).equal("2020.05.02")
        should(res.EventSponsor).equal("USCF")
        should(res.Section).equal("A")
        should(res.Stage).equal("Final")
        should(res.Board).equal(1)
    })
    it("should read all opening information (local specific and third party vendors)", function () {
        let res = parse_tags('[Opening "EPD Opcode v0"] [Variation "EPD Opcode v1"] ' +
            '[SubVariation "EPD Opcode v2"] [ECO "XDD/DD"] [NIC "NIC Variation"]')
        should(res.Opening).equal("EPD Opcode v0")
        should(res.Variation).equal("EPD Opcode v1")
        should(res.SubVariation).equal("EPD Opcode v2")
        should(res.ECO).equal("XDD/DD")
        should(res.NIC).equal("NIC Variation")
    })
    it("should read alternative starting positions", function () {
        let res = parse_tags('[FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"] [SetUp "1"]')
        should(res.SetUp).equal("1")
        should(res.FEN).equal("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
    })
    // '["Key" "Value"] ["Key" "Value"] ["Key" "Value"] ["Key" "Value"] ["Key" "Value"] ["Key" "Value"] '
    it("should read game conclusion and misc", function () {
        let res = parse_tags('[Termination "death"] [Annotator "Me"] [Mode "OTB"] [PlyCount "17"]')
        should(res.Termination).equal("death")
        should(res.Annotator).equal("Me")
        should(res.Mode).equal("OTB")
        should(res.PlyCount).equal(17)
    })
})

describe("When working with different formats for dates", function () {
    it("should read the date if well formed", function () {
        let res = parse_tags(('[Date "2020.06.16"] [EventDate "2020.05.31"] [UTCDate "2021.02.28"]'))
        should(res.Date.value).equal("2020.06.16")
        should(res.Date.year).equal(2020)
        should(res.Date.month).equal(6)
        should(res.Date.day).equal(16)
        should(res.EventDate.value).equal("2020.05.31")
        should(res.UTCDate.value).equal("2021.02.28")
    })
    it("should allow question marks instead of parts of the date", function () {
        let res = parse_tags('[Date "2020.??.??"] [EventDate "2020.12.??"] [UTCDate "????.??.??"]')
        should(res.Date.value).equal("2020.??.??")
        should(res.Date.year).equal(2020)
        should(res.Date.month).equal("??")
        should(res.EventDate.value).equal("2020.12.??")
        should(res.UTCDate.value).equal("????.??.??")
    })
    it("should read all time and date related information", function () {
        let res = parse_tags('[Time "09:20:15"] [UTCTime "23:59:59"]')
        should(res.Time.value).equal("09:20:15")
        should(res.Time.hour).equal(9)
        should(res.UTCTime.value).equal("23:59:59")
    })
    it("should raise errors when date or time format is wrong", function (){
        should(function () { parse_tags('[Date "2020"]') } ).throwError()
        should(function () { parse_tags('[Date "2020.12"]') } ).throwError()
        should(function () { parse_tags('[Date "2020.12.xx"]') } ).throwError()
        should(function () { parse_tags('[UTCDate "?.12.??"]') } ).throwError()
    })

})

describe("When trying to find different variations how to write tags", function () {
    it("should read any order (just some examples)", function () {
        let res = parse_tags('[Black "Me"] [Round "3"] [White "Magnus"] [Site "Oslo"] ' +
            '[Result "1-0"] [Date "2020.04.28"]')
        should(res.White).equal("Magnus")
        should(res.Site).equal("Oslo")
        should(res.Date.value).equal("2020.04.28")
        should(res.Result).equal("1-0")
        should(res.Round).equal("3")
        should(res.Black).equal("Me")
    })
    it("should allow duplicate entries, last one winning", function () {
        let res = parse_tags('[ECO "ECO0815"] [White "You"] [ECO "ECO1"] [White "Me"] [SetUp "0"]')
        should(res.White).equal("Me")
        should(res.ECO).equal("ECO1")
        should(res.SetUp).equal("0")
    })
    it("should allow any kind of whitespace in between, before and after", function () {
        let res = parse_tags(' \t[White \t\n"Value"] \r\t [Black "Value"] [Site "Value"]\r')
        should(res.White).equal("Value")
        should(res.Black).equal("Value")
        should(res.Site).equal("Value")
    })
    it("should allow some variations in upper- and lowercase", function () {
        let res = parse_tags('[white "Me"] [Whiteelo "2400"] [Eventdate "2020.12.24"] [plyCount "23"]')
        should(res.White).equal("Me")
        should(res.WhiteELO).equal(2400)
        should(res.EventDate.value).equal("2020.12.24")
        should(res.PlyCount).equal(23)
    })
    it("should allow variations of SetUp and WhiteELO", function () {
        let res = parse_tags('[Setup "1"][WhiteElo "2700"]')
        should(res.SetUp).equal("1")
        should(res.WhiteELO).equal(2700)
    })

})
describe("When mixing different kinds of tags", function () {
    it("should understand if tags begin with the same word", function () {
        let res = parse_tags('[White "Me"][WhiteELO "1234"]')
    })
    it("should understand if tags begin with the same word for black as well", function () {
        let res = parse_tags('[Black "Me"][BlackTitle "GM"][BlackELO "1234"]')
    })
    it("should understand all mixes of Event in the tags", function () {
        let res = parse_tags('[Event "Me"][EventDate "2020.06.05"][EventSponsor "Magnus"]')
    })
})

describe("Signal collect tags for unknown keys", function () {
    it("should record tag and string value for any key not known", function () {
        let res = parse_tags('[Bar "Foo"]')
        should(res.Bar).equal("Foo")
    })
    it ("should record lichess puzzle tags", function () {
        let res = parse_tags('[PuzzleCategory "Material"]\n' +
            '[PuzzleEngine "Stockfish 13"]\n' +
            '[PuzzleMakerVersion "0.5"]\n' +
            '[PuzzleWinner "White"]')
        should(res.PuzzleEngine).equal("Stockfish 13")
        should(res.PuzzleMakerVersion).equal("0.5")
        should(res.PuzzleCategory).equal("Material")
        should(res.PuzzleWinner).equal("White")
    })
})

describe("Allow different kind of results", function () {
    it("should read all kind of results: *", function () {
        let res = parse_tags('[Result "*"]')
        should(res.Result).equal("*")
    })
    it("should read all kind of results: 1-0", function () {
        let res = parse_tags('[Result "1-0"]')
        should(res.Result).equal("1-0")
    })
    it("should read all kind of results: 0-1", function () {
        let res = parse_tags('[Result "0-1"]')
        should(res.Result).equal("0-1")
    })
    it("should read all kind of results: 1/2-1/2", function () {
        let res = parse_tags('[Result "1/2-1/2"]')
        should(res.Result).equal("1/2-1/2")
    })
    it("should signal error on result: 1:0", function () {
        should(function () { parse_tags('[Result "1:0"]') } ).throwError()
    })
})

describe("Allow additional tags from lichess and twic", function () {
    it("should understand the variant tag", function () {
        let res = parse_tags('[Variant "Crazyhouse"]')
        should(res.Variant).equal("Crazyhouse")
    })
    it("should understand the WhiteRatingDiff tag", function () {
        let res = parse_tags('[WhiteRatingDiff "+8"]')
        should(res.WhiteRatingDiff).equal("+8")
    })
    it("should understand the BlackRatingDiff tag", function () {
        let res = parse_tags('[BlackRatingDiff "+8"]')
        should(res.BlackRatingDiff).equal("+8")
    })
    it("should understand the WhiteFideId tag", function () {
        let res = parse_tags('[WhiteFideId "1503014"]')
        should(res.WhiteFideId).equal("1503014")
    })
    it("should understand the BlackFideId tag", function () {
        let res = parse_tags('[BlackFideId "1503014"]')
        should(res.BlackFideId).equal("1503014")
    })
    it("should understand the WhiteTeam tag", function () {
        let res = parse_tags('[WhiteTeam "Sweden"]')
        should(res.WhiteTeam).equal("Sweden")
    })
    it("should understand the BlackTeam tag", function () {
        let res = parse_tags('[BlackTeam "Sweden"]')
        should(res.BlackTeam).equal("Sweden")
    })
})

describe("Understand all possible TimeControl tags", function () {
    it("should read TimeControl tag at all", function () {
        let res = parse_tags('[TimeControl "?"]')
        should.exist(res)
    })
    it("should read TimeControl tag of kind unknown", function () {
        let res = parse_tags('[TimeControl "?"]')
        should.exist(res)
        should.exist(res.TimeControl)
        should(res.TimeControl.kind).equal("unknown")
        should(res.TimeControl.value).equal("?")
    })
    it("should read TimeControl tag of kind unlimited", function () {
        let res = parse_tags('[TimeControl "-"]')
        should.exist(res)
        should.exist(res.TimeControl)
        should(res.TimeControl.kind).equal("unlimited")
        should(res.TimeControl.value).equal("-")
    })
    it("should read TimeControl tag of kind movesInSeconds", function () {
        let res = parse_tags('[TimeControl "40/9000"]')
        should.exist(res)
        should.exist(res.TimeControl)
        should(res.TimeControl.kind).equal("movesInSeconds")
        should(res.TimeControl.moves).equal(40)
        should(res.TimeControl.seconds).equal(9000)
    })
    it("should read TimeControl tag of kind suddenDeath", function () {
        let res = parse_tags('[TimeControl "60"]')
        should.exist(res)
        should.exist(res.TimeControl)
        should(res.TimeControl.kind).equal("suddenDeath")
        should(res.TimeControl.seconds).equal(60)
    })
    it("should read TimeControl tag of kind increment", function () {
        let res = parse_tags('[TimeControl "60+1"]')
        should.exist(res)
        should.exist(res.TimeControl)
        should(res.TimeControl.kind).equal("increment")
        should(res.TimeControl.seconds).equal(60)
        should(res.TimeControl.increment).equal(1)
    })
    it("should read TimeControl tag of kind hourglass", function () {
        let res = parse_tags('[TimeControl "*60"]')
        should.exist(res)
        should.exist(res.TimeControl)
        should(res.TimeControl.kind).equal("hourglass")
        should(res.TimeControl.seconds).equal(60)
    })
    it("should raise an error for wrong formats", function () {
        should(function () { parse_tags('[TimeControl ""]') } ).throwError()
        should(function () { parse_tags('[TimeControl "+"]') } ).throwError()
        should(function () { parse_tags('[TimeControl "400+"]') } ).throwError()
        should(function () { parse_tags('[TimeControl "400*"]') } ).throwError()
        should(function () { parse_tags('[TimeControl "40/600+40"]') } ).throwError()
    })
})