var parser = require("../pgn-parser.js");

var expect = require('expect.js');

describe("When working with PGN as string", function() {
    var my_result;
    describe("When having read the moves", function() {
        it("should have 16 half-moves read", function() {
            my_result =  parser.parse("1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e6 7. f3 Be7 8. Qd2 Qc7 ");
            let moves = my_result[0];
            expect(moves.length).to.be(16);
            var first = moves[0];
            var sec = moves[1];
            var seventh = moves[6];
            expect(first.notation.notation).to.be("e4");
            expect(first.turn).to.be('w');
            expect(sec.turn).to.be('b');
            //expect(sec.moveNumber).toBeUndefined();
            expect(seventh.moveNumber).to.be(4);
            expect(seventh.turn).to.be('w');
            expect(seventh.notation.notation).to.be('Nxd4');
        })
    });
});

describe("When reading complete game starting with the first move", function () {
    it("should notice white starting and color switching each move", function () {
        let my_res = parser.parse("1. e4 e5 2. Nf3")[0];
        expect(my_res.length).to.be(3);
        expect(my_res[0].turn).to.be("w");
        expect(my_res[1].turn).to.be("b");
        expect(my_res[2].turn).to.be("w");
    })
    // This is not possible due to the lax interpretation of PGN with move numbers
    // This has to be corrected by the reader later, that has a position as well.
    xit("should notice black starting and other colors for moves", function () {
        let my_res = parser.parse("1... e5 2. Nf3")[0];
        expect(my_res.length).to.be(2);
        expect(my_res[0].turn).to.be("b");
        expect(my_res[1].turn).to.be("w");

    })
    it("should read all kind of move numbers without problems", function () {
        let my_res = parser.parse("1... e4 1... e5 2.. d4 2 . d5 f4 3. f5") [0]
        expect(my_res.length).to.be(6)
        expect(my_res[0].turn).to.be("w")
        expect(my_res[0].notation.notation).to.be("e4")
        expect(my_res[0].moveNumber).to.be(1)
        expect(my_res[1].moveNumber).to.be(1)
        expect(my_res[2].moveNumber).to.be(2)
        expect(my_res[3].moveNumber).to.be(2)
        expect(my_res[4].moveNumber).to.be(null)
        expect(my_res[5].moveNumber).to.be(3)
    })
})

describe("When a game notes a result at the end", function () {
    it("should have the result as last entry of the array", function () {
        let my_res = parser.parse("1. e4 1:0")[0]
        expect(my_res.length).to.be(2)
        expect(my_res[1]).to.be("1:0")
    })
    it("should have all kinds or result: 1:0", function () {
        let my_res = parser.parse("1. e4 1:0")[0]
        expect(my_res[1]).to.be("1:0")
    })
    it("should have all kinds or result: 0:1", function () {
        let my_res = parser.parse("1. e4 0:1")[0]
        expect(my_res[1]).to.be("0:1")
    })
    it("should have all kinds or result: 1-0", function () {
        let my_res = parser.parse("1. e4 1-0")[0]
        expect(my_res[1]).to.be("1-0")
    })
    it("should have all kinds or result: 0-1", function () {
        let my_res = parser.parse("1. e4 0-1")[0]
        expect(my_res[1]).to.be("0-1")
    })
    it("should have all kinds or result: 1/2-1/2", function () {
        let my_res = parser.parse("1. e4  1/2-1/2")[0]
        expect(my_res[1]).to.be("1/2-1/2")
    })
    it("should have all kinds or result: *", function () {
        let my_res = parser.parse("1. e4  *")[0]
        expect(my_res[1]).to.be("*")
    })
    it("should ignore additional white space before or after", function () {
        let my_res = parser.parse("1. e4     *    ")[0]
        expect(my_res[1]).to.be("*")
    })
    it("should ignore additional white space before or after", function () {
        let my_res = parser.parse("1. e4     1:0    ")[0]
        expect(my_res[1]).to.be("1:0")
    })
})

describe("Reading PGN game with all kinds of comments", function () {
    it("should read comments at all locations", function () {
        let my_res = parser.parse("{First} 1. {second} e4 {third} e5! {fourth}")[0]
        expect(my_res.length).to.be(2)
        expect(my_res[0].commentMove).to.be("First")
        expect(my_res[0].commentBefore).to.be("second")
        expect(my_res[0].commentAfter).to.be("third")
        expect(my_res[1].commentBefore).to.be(null)
        expect(my_res[1].commentAfter).to.be("fourth")
    })
    it("should ignore additional whitespace when reading comments", function () {
        let my_res = parser.parse("  {First  } 1. {  second}   e4   {  third  } e5! {    fourth  }   ")[0]
        expect(my_res.length).to.be(2)
        expect(my_res[0].commentBefore).to.be("second")
        expect(my_res[0].commentAfter).to.be("third")
        expect(my_res[1].commentBefore).to.be(null)
        expect(my_res[1].commentAfter).to.be("fourth")
    })
    it("should understand comment annotations: fields", function () {
        let my_res = parser.parse("1. e4 {[%csl Ye4,Rd4,Ga1,Bh1]}")[0]
        expect(my_res[0].commentDiag).not.to.equal(null)
        expect(my_res[0].commentDiag.colorFields).to.be.ok()
        expect(my_res[0].commentDiag.colorFields[0]).to.be("Ye4")
        expect(my_res[0].commentDiag.colorFields[1]).to.be("Rd4")
        expect(my_res[0].commentDiag.colorFields[2]).to.be("Ga1")
        expect(my_res[0].commentDiag.colorFields[3]).to.be("Bh1")
    })
    it("should understand comment annotations: arrows", function () {
        let my_res = parser.parse("1. e4 {[%cal Ye4e8,Rd4a4,Ga1h8,Bh1c7]}")[0]
        expect(my_res[0].commentDiag).not.to.equal(null)
        expect(my_res[0].commentDiag.colorArrows).to.be.ok()
        expect(my_res[0].commentDiag.colorArrows[0]).to.be("Ye4e8")
        expect(my_res[0].commentDiag.colorArrows[1]).to.be("Rd4a4")
        expect(my_res[0].commentDiag.colorArrows[2]).to.be("Ga1h8")
        expect(my_res[0].commentDiag.colorArrows[3]).to.be("Bh1c7")
    })
})

