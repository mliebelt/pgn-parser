import { suite } from 'uvu';
import assert from 'uvu/assert';
import {parse, parseGame} from "../src"
import {ParseTree} from "../src"
import { Tags, PgnMove} from "@mliebelt/pgn-types"

function parseTags(string: string):Tags {
    let pt: ParseTree = parse(string, { startRule: "tags" }) as ParseTree
    return pt.tags as Tags
}

const whenWorkingWithTags = suite("When working with all kind of tags")
whenWorkingWithTags("should read one tag", function () {
        let res = parseTags('[White "Me"]')
        assert.is(Object.keys(res).length,2)
        assert.is(res.White,"Me")
    })
whenWorkingWithTags("should read all 7 rooster tags", function () {
        let res = parseTags('[Event "What a tournament"] [Site "My home town"] [Date "2020.05.16"] ' +
            '[Round "1"] [White "Me"] [Black "Magnus"] [Result "1-0"][WhiteTitle "GM"]')
        assert.is(res.Event,"What a tournament")
        assert.is(res.Site,"My home town")
        assert.is(res.Round,"1")
        assert.is(res.White,"Me")
        assert.is(res.Black,"Magnus")
        assert.is(res.Result,"1-0")
        assert.is(res.Date.value,"2020.05.16")
    })
whenWorkingWithTags("should read all optional player related", function () {
        let res = parseTags(
            '[WhiteTitle "GM"] [BlackTitle "IM"] ' +
            '[WhiteELO "2899"] [BlackELO "700"] [WhiteUSCF "1234"] [BlackUSCF "1234"] [WhiteNA "m.c@norway.com"]' +
            '[BlackNA "me@world.org"] [WhiteType "Human"] [BlackType "Computer"]')
        assert.is(res.WhiteTitle,"GM") 
        assert.is(res.BlackTitle,"IM") 
        assert.is(res.WhiteElo,2899) 
        assert.is(res.BlackElo,700) 
        assert.is(res.WhiteUSCF,1234) 
        assert.is(res.BlackUSCF,1234) 
        assert.is(res.WhiteNA,"m.c@norway.com") 
        assert.is(res.BlackNA,"me@world.org") 
        assert.is(res.WhiteType,"Human") 
        assert.is(res.BlackType,"Computer") 
    })
whenWorkingWithTags("should read all event related information", function () {
        let res = parseTags('[EventDate "2020.05.02"] [EventSponsor "USCF"] [Section "A"] ' +
            '[Stage "Final"] [Board "1"]')
        assert.is(res.EventDate.value,"2020.05.02") 
        assert.is(res.EventSponsor,"USCF") 
        assert.is(res.Section,"A") 
        assert.is(res.Stage,"Final") 
        assert.is(res.Board,1) 
    })
whenWorkingWithTags("should read all opening information (local specific and third party vendors)", function () {
        let res = parseTags('[Opening "EPD Opcode v0"] [Variation "EPD Opcode v1"] ' +
            '[SubVariation "EPD Opcode v2"] [ECO "XDD/DD"] [NIC "NIC Variation"]')
        assert.is(res.Opening,"EPD Opcode v0") 
        assert.is(res.Variation,"EPD Opcode v1") 
        assert.is(res.SubVariation,"EPD Opcode v2") 
        assert.is(res.ECO,"XDD/DD") 
        assert.is(res.NIC,"NIC Variation") 
    })
whenWorkingWithTags("should read alternative starting positions", function () {
        let res = parseTags('[FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"] [SetUp "1"]')
        assert.is(res.SetUp,"1") 
        assert.is(res.FEN,"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") 
    })
    // '["Key" "Value"] ["Key" "Value"] ["Key" "Value"] ["Key" "Value"] ["Key" "Value"] ["Key" "Value"] '
whenWorkingWithTags("should read game conclusion and misc", function () {
        let res = parseTags('[Termination "death"] [Annotator "Me"] [Mode "OTB"] [PlyCount "17"]')
        assert.is(res.Termination,"death") 
        assert.is(res.Annotator,"Me") 
        assert.is(res.Mode,"OTB") 
        assert.is(res.PlyCount,17) 
    })
whenWorkingWithTags("should read ELO as integer all the time (empty case)", function () {
        let res = parseTags('[WhiteElo ""]')
        assert.is(res.WhiteElo,0) 
        assert.is(res.messages[0].message,"Use \"-\" for an unknown value") 
    })
whenWorkingWithTags("should read ELO as integer all the time (dash case)", function () {
        let res = parseTags('[WhiteElo "-"]')
        assert.is(res.WhiteElo,0) 
    })
whenWorkingWithTags.run()

const differentFormatDates = suite("When working with different formats for dates")
differentFormatDates("should read the date if well formed", function () {
        let res = parseTags(('[Date "2020.06.16"] [EventDate "2020.05.31"] [UTCDate "2021.02.28"]'))
        assert.is(res.Date.value,"2020.06.16") 
        assert.is(res.Date.year,2020) 
        assert.is(res.Date.month,6) 
        assert.is(res.Date.day,16) 
        assert.is(res.EventDate.value,"2020.05.31") 
        assert.is(res.UTCDate.value,"2021.02.28") 
    })
differentFormatDates("should allow question marks instead of parts of the date", function () {
        let res = parseTags('[Date "2020.??.??"] [EventDate "2020.12.??"] [UTCDate "????.??.??"]')
        assert.is(res.Date.value,"2020.??.??") 
        assert.is(res.Date.year,2020) 
        assert.is(res.Date.month,"??") 
        assert.is(res.EventDate.value,"2020.12.??") 
        assert.is(res.UTCDate.value,"????.??.??") 
    })
differentFormatDates("should read all time and date related information", function () {
        let res = parseTags('[Time "09:20:15"] [UTCTime "23:59:59"]')
        assert.is(res.Time.value,"09:20:15") 
        assert.is(res.Time.hour,9) 
        assert.is(res.UTCTime.value,"23:59:59") 
    })
differentFormatDates("should collect messages for wrong date or time format", function (){
        let res = parseTags('[Date "2020"]')
        assert.is(res.messages.length,1) 
        assert.is(res.messages[0].message,'Format of tag: "Date" not correct: "2020"') 
        res = parseTags('[Date "2020.12"]')
        assert.is(res.messages.length,1) 
        assert.is(res.messages[0].message,'Format of tag: "Date" not correct: "2020.12"') 
        res = parseTags('[Date "2020.12.xx"]')
        assert.is(res.messages.length,1) 
        assert.is(res.messages[0].message,'Format of tag: "Date" not correct: "2020.12.xx"') 
        res = parseTags('[UTCDate "?.12.??"]')
        assert.is(res.messages.length,1) 
        assert.is(res.messages[0].message,'Format of tag: "UTCDate" not correct: "?.12.??"') 
    })
differentFormatDates.run()

const tryDifferentVariations = suite("When trying to find different variations how to write tags")
tryDifferentVariations("should read any order (just some examples)", function () {
        let res = parseTags('[Black "Me"] [Round "3"] [White "Magnus"] [Site "Oslo"] ' +
            '[Result "1-0"] [Date "2020.04.28"]')
        assert.is(res.White,"Magnus") 
        assert.is(res.Site,"Oslo") 
        assert.is(res.Date.value,"2020.04.28") 
        assert.is(res.Result,"1-0") 
        assert.is(res.Round,"3") 
        assert.is(res.Black,"Me") 
    })
tryDifferentVariations("should allow duplicate entries, last one winning", function () {
        let res = parseTags('[ECO "ECO0815"] [White "You"] [ECO "ECO1"] [White "Me"] [SetUp "0"]')
        assert.is(res.White,"Me") 
        assert.is(res.ECO,"ECO1") 
        assert.is(res.SetUp,"0") 
    })
tryDifferentVariations("should allow any kind of whitespace in between, before and after", function () {
        let res = parseTags(' \t[White \t\n"Value"] \r\t [Black "Value"] [Site "Value"]\r')
        assert.is(res.White,"Value") 
        assert.is(res.Black,"Value") 
        assert.is(res.Site,"Value") 
    })
tryDifferentVariations("should allow some variations in upper- and lowercase", function () {
        let res = parseTags('[white "Me"] [Whiteelo "2400"] [Eventdate "2020.12.24"] [plyCount "23"]')
        assert.is(res.White,"Me") 
        assert.is(res.WhiteElo,2400) 
        assert.is(res.EventDate.value,"2020.12.24") 
        assert.is(res.PlyCount,23) 
    })
tryDifferentVariations("should allow variations of SetUp and WhiteELO", function () {
        let res = parseTags('[Setup "1"][WhiteElo "2700"]')
        assert.is(res.SetUp,"1") 
        assert.is(res.WhiteElo,2700) 
    })
tryDifferentVariations.run()

const mixingDifferentTags = suite("When mixing different kinds of tags")
mixingDifferentTags("should understand if tags begin with the same word", function () {
        let res = parseTags('[White "Me"][WhiteELO "1234"]')
    })
mixingDifferentTags("should understand if tags begin with the same word for black as well", function () {
        let res = parseTags('[Black "Me"][BlackTitle "GM"][BlackELO "1234"]')
    })
mixingDifferentTags("should understand all mixes of Event in the tags", function () {
        let res = parseTags('[Event "Me"][EventDate "2020.06.05"][EventSponsor "Magnus"]')
    })
mixingDifferentTags.run()

const unknownKeys = suite("Signal collect tags for unknown keys")
unknownKeys("should record tag and string value for any key not known", function () {
        let res = <{ Bar: string }><unknown>parseTags('[Bar "Foo"]')
        assert.is(res.Bar,"Foo") 
    })
unknownKeys ("should record lichess puzzle tags", function () {
        let res = parseTags('[PuzzleCategory "Material"]\n' +
            '[PuzzleEngine "Stockfish 13"]\n' +
            '[PuzzleMakerVersion "0.5"]\n' +
            '[PuzzleWinner "White"]')
        assert.is(res.PuzzleEngine,"Stockfish 13") 
        assert.is(res.PuzzleMakerVersion,"0.5") 
        assert.is(res.PuzzleCategory,"Material") 
        assert.is(res.PuzzleWinner,"White") 
    })
unknownKeys.run()

const allowDifferentResults = suite("Allow different kind of results")
allowDifferentResults("should read all kind of results: *", function () {
        let res = parseTags('[Result "*"]')
        assert.is(res.Result,"*") 
    })
allowDifferentResults("should read all kind of results: 1-0", function () {
        let res = parseTags('[Result "1-0"]')
        assert.is(res.Result,"1-0") 
    })
allowDifferentResults("should read all kind of results: 0-1", function () {
        let res = parseTags('[Result "0-1"]')
        assert.is(res.Result,"0-1") 
    })
allowDifferentResults("should read all kind of results: 1/2-1/2", function () {
        let res = parseTags('[Result "1/2-1/2"]')
        assert.is(res.Result,"1/2-1/2") 
        res = parseTags('[Result "1/2"]')
        assert.is(res.Result,"1/2-1/2") 

    })
allowDifferentResults("should signal error on result: 1:0", function () {
        let res = parseTags('[Result "1:0"]')
        assert.is(res.Result,"1:0") 
        assert.is(res.messages.length,1) 
    })
allowDifferentResults.run()

const allowTagsLichessTwic = suite("Allow additional tags from lichess and twic")
allowTagsLichessTwic("should understand the variant tag", function () {
        let res = parseTags('[Variant "Crazyhouse"]')
        assert.is(res.Variant,"Crazyhouse") 
    })
allowTagsLichessTwic("should understand the WhiteRatingDiff tag", function () {
        let res = parseTags('[WhiteRatingDiff "+8"]')
        assert.is(res.WhiteRatingDiff,"+8") 
    })
allowTagsLichessTwic("should understand the BlackRatingDiff tag", function () {
        let res = parseTags('[BlackRatingDiff "+8"]')
        assert.is(res.BlackRatingDiff,"+8") 
    })
allowTagsLichessTwic("should understand the WhiteFideId tag", function () {
        let res = parseTags('[WhiteFideId "1503014"]')
        assert.is(res.WhiteFideId,"1503014") 
    })
allowTagsLichessTwic("should understand the BlackFideId tag", function () {
        let res = parseTags('[BlackFideId "1503014"]')
        assert.is(res.BlackFideId,"1503014") 
    })
allowTagsLichessTwic("should understand the WhiteTeam tag", function () {
        let res = parseTags('[WhiteTeam "Sweden"]')
        assert.is(res.WhiteTeam,"Sweden") 
    })
allowTagsLichessTwic("should understand the BlackTeam tag", function () {
        let res = parseTags('[BlackTeam "Sweden"]')
        assert.is(res.BlackTeam,"Sweden") 
    })
allowTagsLichessTwic.run()

const timeControlTags = suite("Understand all possible TimeControl tags")
timeControlTags("should read TimeControl tag at all", function () {
        let res = parseTags('[TimeControl "?"]')
        assert.ok(res) 
    })
timeControlTags("should read TimeControl tag of kind unknown", function () {
        let res = parseTags('[TimeControl "?"]')
        assert.ok(res) 
        assert.ok(res.TimeControl) 
        assert.is(res.TimeControl[0].kind,"unknown") 
        assert.is(res.TimeControl.value,"?") 
    })
timeControlTags("should read TimeControl tag of kind unlimited", function () {
        let res = parseTags('[TimeControl "-"]')
        assert.ok(res) 
        assert.ok(res.TimeControl) 
        assert.is(res.TimeControl[0].kind,"unlimited") 
        assert.is(res.TimeControl.value,"-") 
    })
timeControlTags("should read TimeControl tag of kind movesInSeconds", function () {
        let res = parseTags('[TimeControl "40/9000"]')
        assert.ok(res) 
        assert.ok(res.TimeControl) 
        assert.is(res.TimeControl[0].kind,"movesInSeconds") 
        assert.is(res.TimeControl[0].moves,40) 
        assert.is(res.TimeControl[0].seconds,9000) 
        assert.is(res.TimeControl.value,"40/9000") 
    })
timeControlTags("should read TimeControl tag of kind suddenDeath", function () {
        let res = parseTags('[TimeControl "60"]')
        assert.ok(res) 
        assert.ok(res.TimeControl) 
        assert.is(res.TimeControl[0].kind,"suddenDeath") 
        assert.is(res.TimeControl[0].seconds,60) 
        assert.is(res.TimeControl.value,"60") 
    })
timeControlTags("should read TimeControl tag of kind increment", function () {
        let res = parseTags('[TimeControl "60+1"]')
        assert.ok(res) 
        assert.ok(res.TimeControl) 
        assert.is(res.TimeControl[0].kind,"increment") 
        assert.is(res.TimeControl[0].seconds,60) 
        assert.is(res.TimeControl[0].increment,1) 
        assert.is(res.TimeControl.value,"60+1") 
    })
timeControlTags("should read TimeControl tag of kind hourglass", function () {
        let res = parseTags('[TimeControl "*60"]')
        assert.ok(res) 
        assert.ok(res.TimeControl) 
        assert.is(res.TimeControl[0].kind,"hourglass") 
        assert.is(res.TimeControl[0].seconds,60) 
        assert.is(res.TimeControl.value,"*60") 
    })
timeControlTags("should understand common time format: German tournament (no increment)", function () {
        let res = parseTags('[TimeControl "40/7200:3600"]')
        assert.ok(res) 
        assert.is(res.TimeControl[0].kind,"movesInSeconds") 
        assert.is(res.TimeControl[0].seconds,7200) 
        assert.is(res.TimeControl[0].moves,40) 
        assert.is(res.TimeControl[1].kind,"suddenDeath") 
        assert.is(res.TimeControl[1].seconds,3600) 
        assert.is(res.TimeControl.value,"40/7200:3600") 
    })
timeControlTags("should understand common time format: German Bundesliga (with increment)", function () {
        let res = parseTags('[TimeControl "40/6000+30:3000+30"]')
        assert.ok(res) 
        assert.is(res.TimeControl[0].kind,"movesInSecondsIncrement") 
        assert.is(res.TimeControl[0].moves,40) 
        assert.is(res.TimeControl[0].seconds,6000) 
        assert.is(res.TimeControl[0].increment,30) 
        assert.is(res.TimeControl[1].seconds,3000) 
        assert.is(res.TimeControl[1].increment,30) 
        assert.is(res.TimeControl.value,"40/6000+30:3000+30") 
    })
timeControlTags("should raise an error for empty time control", function () {
        let res = parseTags('[TimeControl ""]')
        assert.ok(res) 
        assert.is(res.messages[0].message,'Tag TimeControl has to have a value') 
    })
timeControlTags("should raise an error for wrong formats", function () {
        let res
        res = parseTags('[TimeControl "+"]')
        assert.is(res.messages.length,1) 
        assert.is(res.messages[0].message,'Format of tag: "TimeControl" not correct: "+"') 
        res = parseTags('[TimeControl "400+"]')
        assert.is(res.messages.length,1) 
        assert.is(res.messages[0].message,'Format of tag: "TimeControl" not correct: "400+"') 
        res = parseTags('[TimeControl "400*"]')
        assert.is(res.messages.length,1) 
        assert.is(res.messages[0].message,'Format of tag: "TimeControl" not correct: "400*"') 
    })
timeControlTags("should raise an error for all periods with some error in it", function () {
        let res = parseTags('[TimeControl "400+:400*"]')
        assert.is(res.messages.length,1) 
        assert.is(res.messages[0].message,'Format of tag: "TimeControl" not correct: "400+:400*"') 
    })
timeControlTags("should raise an error for unknown TimeControl", function () {
        let res = parseTags('[TimeControl "60 minutes"]')
        assert.is(res.messages.length,1) 
        assert.is(res.messages[0].message,'Format of tag: "TimeControl" not correct: "60 minutes"') 
    })
timeControlTags.run()

const clockContext = suite("When reading tags with clock context")
clockContext("should understand the normal Clock format, color White", function (){
        let res = parseTags('[Clock "W/0:45:56"]')
        assert.ok(res) 
        assert.is(res.Clock,"W/0:45:56") 
        assert.is(res.messages.length,0) 
    })
clockContext("should understand the normal Clock format, clock stopped", function (){
        let res = parseTags('[Clock "N/0:45:56"]')
        assert.ok(res) 
        assert.is(res.Clock,"N/0:45:56") 
        assert.is(res.messages.length,0) 
    })
clockContext("should understand the normal WhiteClock format", function (){
        let res = parseTags('[WhiteClock "1:25:50"]')
        assert.ok(res) 
        assert.is(res.WhiteClock,"1:25:50") 
        assert.is(res.messages.length,0) 
    })
clockContext("should understand the normal BlackClock format", function (){
        let res = parseTags('[BlackClock "0:05:15"]')
        assert.ok(res) 
        assert.is(res.BlackClock,"0:05:15") 
        assert.is(res.messages.length,0) 
    })
clockContext.run()

const readingStrangeFormats = suite("When reading strange formats")
readingStrangeFormats("should understand even tags with special characters", function () {
        let res = parseTags('[Event "Let\'s Play!"]')
        assert.ok(res) 
    })
readingStrangeFormats("should understand games with doublequotes inside strings when escaped (#309)", function() {
        let res = parseTags('[Event "Bg7 in the Sicilian: 2.Nf3 d6 3.Bc4 - The \\"Closed\\" Dragon"]')
        assert.ok(res) 
    })
readingStrangeFormats("should understand all tags even with strange characters (#349)", function () {
       let res = parseTags('[Event ""]\n' +
           '[White "зада~~а 1"]\n' +
           '[Black ""]\n' +
           '[Site ""]\n' +
           '[Round ""]\n' +
           '[Annotator ""]\n' +
           '[Result "*"]\n' +
           '[Date "2020.07.12"]\n' +
           '[PlyCount "3"]\n' +
           '[Setup "1"]\n' +
           '[FEN "4r1k1/1q3ppp/p7/8/Q3r3/8/P4PPP/R3R1K1 w - - 0 1"]')
        assert.ok(res) 
    })
readingStrangeFormats("should handle BOM on the beginning of games", function () {
        let res = parseTags('\uFEFF[Event ""]\n' +
            '[Setup "1"]\n' +
            '[FEN "4r1k1/1q3ppp/p7/8/Q3r3/8/P4PPP/R3R1K1 w - - 0 1"]\n')
        assert.ok(res) 
    })
readingStrangeFormats.run()