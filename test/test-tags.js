var parser = require("../pgn-parser.js");

var expect = require('expect.js');

function parse_tags(string) {
    return parser.parse(string, { startRule: "tags" })
}

describe("When working with all kind of tags", function () {
    it("should read one tag", function () {
        let res = parse_tags('["White" "Me"]')
        expect(Object.keys(res).length).to.be(1)
    })
    it("should read all 7 rooster tags", function () {
        let res = parse_tags('["Event" "What a tournament"] ["Site" "My home town"] ["Date" "2020.05.16"] ' +
            '["Round" "1"] ["White" "Me"] ["Black" "Magnus"] ["Result" "1-0"]')
        expect(res.Event).to.be("What a tournament")
        expect(res.Site).to.be("My home town")
        expect(res.Round).to.be("1")
        expect(res.White).to.be("Me")
        expect(res.Black).to.be("Magnus")
        expect(res.Result).to.be("1-0")
        expect(res.Date).to.be("2020.05.16")
    })
    it("should read all optional player related", function () {
        let res = parse_tags(
            '["WhiteTitle" "GM"] ["BlackTitle" "IM"] ' +
            '["WhiteELO" "2899"] ["BlackELO" "700"] ["WhiteUSCF" "1234"] ["BlackUSCF" "1234"] ["WhiteNA" "m.c@norway.com"]' +
            '["BlackNA" "me@world.org"] ["WhiteType" "Human"] ["BlackType" "Computer"]')
        expect(res.WhiteTitle).to.be("GM")
        expect(res.BlackTitle).to.be("IM")
        expect(res.WhiteELO).to.be(2899)
        expect(res.BlackELO).to.be(700)
        expect(res.WhiteUSCF).to.be(1234)
        expect(res.BlackUSCF).to.be(1234)
        expect(res.WhiteNA).to.be("m.c@norway.com")
        expect(res.BlackNA).to.be("me@world.org")
        expect(res.WhiteType).to.be("Human")
        expect(res.BlackType).to.be("Computer")
    })
    it("should read all event related information", function () {
        let res = parse_tags('["EventDate" "2020.05.02"] ["EventSponsor" "USCF"] ["Section" "A"] ' +
            '["Stage" "Final"] ["Board" "1"]')
        expect(res.EventDate).to.be("2020.05.02")
        expect(res.EventSponsor).to.be("USCF")
        expect(res.Section).to.be("A")
        expect(res.Stage).to.be("Final")
        expect(res.Board).to.be(1)
    })
    it("should read all opening information (local specific and third party vendors)", function () {
        let res = parse_tags('["Opening" "EPD Opcode v0"] ["Variation" "EPD Opcode v1"] ' +
            '["SubVariation" "EPD Opcode v2"] ["ECO" "XDD/DD"] ["NIC" "NIC Variation"]')
        expect(res.Opening).to.be("EPD Opcode v0")
        expect(res.Variation).to.be("EPD Opcode v1")
        expect(res.SubVariation).to.be("EPD Opcode v2")
        expect(res.ECO).to.be("XDD/DD")
        expect(res.NIC).to.be("NIC Variation")
    })
    it("should read all time and date related information", function () {
        let res = parse_tags('["Time" "HH:MM:SS"] ["UTCTime" "UTCTime"] ["UTCDate" "UTCDate"]')
        expect(res.Time).to.be("HH:MM:SS")
        expect(res.UTCTime).to.be("UTCTime")
        expect(res.UTCDate).to.be("UTCDate")
    })
    // TODO Define the time control options in the grammar
    it("should read all kind of time control", function () {
        let res = parse_tags('["TimeControl" "?"]')
        expect(res.TimeControl).to.be("?")
    })
    it("should read alternative starting positions", function () {
        let res = parse_tags('["FEN" "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"] ["SetUp" "1"]')
        expect(res.SetUp).to.be("1")
        expect(res.FEN).to.be("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
    })
    // '["Key" "Value"] ["Key" "Value"] ["Key" "Value"] ["Key" "Value"] ["Key" "Value"] ["Key" "Value"] '
    it("should read game conclusion and misc", function () {
        let res = parse_tags('["Termination" "death"] ["Annotator" "Me"] ["Mode" "OTB"] ["PlyCount" "17"]')
        expect(res.Termination).to.be("death")
        expect(res.Annotator).to.be("Me")
        expect(res.Mode).to.be("OTB")
        expect(res.PlyCount).to.be(17)
    })
})
describe("When trying to find different variations how to write tags", function () {
    it("should read any order (just some examples)", function () {
        let res = parse_tags('["Black" "Me"] ["Round" "3"] ["White" "Magnus"] ["Site" "Oslo"] ' +
            '["Result" "1:0"] ["Date" "2020.04.28"]')
        expect(res.White).to.be("Magnus")
        expect(res.Site).to.be("Oslo")
        expect(res.Date).to.be("2020.04.28")
        expect(res.Result).to.be("1:0")
        expect(res.Round).to.be("3")
        expect(res.Black).to.be("Me")
    })
    it("should allow duplicate entries, last one winning", function () {
        let res = parse_tags('["ECO" "ECO0815"] ["White" "You"] ["ECO" "ECO1"] ["White" "Me"] ["SetUp" "0"]')
        expect(res.White).to.be("Me")
        expect(res.ECO).to.be("ECO1")
        expect(res.SetUp).to.be("0")
    })
    it("should allow any kind of whitespace in between, before and after", function () {
        let res = parse_tags(' \t["White" \t\n"Value"] \r\t ["Black" "Value"] ["Site" "Value"]\r')
    })
    // '["Key" "Value"] ["Key" "Value"] ["Key" "Value"] ["Key" "Value"] ["Key" "Value"] ["Key" "Value"] '
    // TODO Define the rules how much variation is allowed
    xit("should allow some variations in upper- and lowercase", function () {

    })
})