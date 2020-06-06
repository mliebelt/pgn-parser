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
        should(res.Date).equal("2020.05.16")
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
        should(res.EventDate).equal("2020.05.02")
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
    it("should read all time and date related information", function () {
        let res = parse_tags('[Time "HH:MM:SS"] [UTCTime "UTCTime"] [UTCDate "UTCDate"]')
        should(res.Time).equal("HH:MM:SS")
        should(res.UTCTime).equal("UTCTime")
        should(res.UTCDate).equal("UTCDate")
    })
    // TODO Define the time control options in the grammar
    it("should read all kind of time control", function () {
        let res = parse_tags('[TimeControl "?"]')
        should(res.TimeControl).equal("?")
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
describe("When trying to find different variations how to write tags", function () {
    it("should read any order (just some examples)", function () {
        let res = parse_tags('[Black "Me"] [Round "3"] [White "Magnus"] [Site "Oslo"] ' +
            '[Result "1:0"] [Date "2020.04.28"]')
        should(res.White).equal("Magnus")
        should(res.Site).equal("Oslo")
        should(res.Date).equal("2020.04.28")
        should(res.Result).equal("1:0")
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
    })
    // '["Key" "Value"] ["Key" "Value"] ["Key" "Value"] ["Key" "Value"] ["Key" "Value"] ["Key" "Value"] '
    // TODO Define the rules how much variation is allowed
    xit("should allow some variations in upper- and lowercase", function () {

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

describe("Allow many more case changes and unknown keys", function () {
    it("should read any key not known", function () {
        let res = parse_tags('[Bar "Foo"]')
        should(res["Bar"]).equal("Foo")
    })
    it("should allow variations of SetUp and WhiteELO", function () {
        let res = parse_tags('[Setup "1"][WhiteElo "2700"]')
        should(res.SetUp).equal("1")
        should(res.WhiteELO).equal(2700)
    })
})