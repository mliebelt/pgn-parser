var parser = require("../pgn-parser.js");

var expect = require('expect.js');

describe("When working with PGN as string", function() {
    let my_result;
    describe("When having read the moves", function() {
        it("should have 16 half-moves read", function() {
            my_result =  parser.parse("1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e6 7. f3 Be7 8. Qd2 Qc7 ");
            let moves = my_result[0];
            expect(moves.length).to.be(16);
            const first = moves[0];
            const sec = moves[1];
            const seventh = moves[6];
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
    // it("should notice black starting and other colors for moves", function () {
    //     let my_res = parser.parse("1... e5 2. Nf3")[0];
    //     expect(my_res.length).to.be(2);
    //     expect(my_res[0].turn).to.be("b");
    //     expect(my_res[1].turn).to.be("w");
    // })
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
    it("should understand combination of fields and arrows", function () {
        let my_res = parser.parse("1. e4 { [%cal Ye4e8] [%csl Rd4] }")[0]
        expect(my_res[0].commentDiag).not.to.equal(null)
        expect(my_res[0].commentDiag.colorFields).to.be.ok()
        expect(my_res[0].commentDiag.colorArrows).to.be.ok()
        expect(my_res[0].commentDiag.colorFields[0]).to.be("Rd4")
        expect(my_res[0].commentDiag.colorArrows[0]).to.be("Ye4e8")
    })
    it("should understand permutations of fields and arrows", function () {
        let my_res = parser.parse("1. e4 { [%csl Rd4] [%cal Ye4e8]  }")[0]
        expect(my_res[0].commentDiag).not.to.equal(null)
        expect(my_res[0].commentDiag.colorFields).to.be.ok()
        expect(my_res[0].commentDiag.colorArrows).to.be.ok()
        expect(my_res[0].commentDiag.colorFields[0]).to.be("Rd4")
        expect(my_res[0].commentDiag.colorArrows[0]).to.be("Ye4e8")
    })
    it("should understand whitespace when adding fields and arrows", function () {
        let my_res = parser.parse("1. e4 { [ %csl   Rd4 ] [%cal   Ye4e8  ,  Gd1d3]  }")[0]
        expect(my_res[0].commentDiag).not.to.equal(null)
        expect(my_res[0].commentDiag.colorFields).to.be.ok()
        expect(my_res[0].commentDiag.colorArrows).to.be.ok()
        expect(my_res[0].commentDiag.colorFields[0]).to.be("Rd4")
        expect(my_res[0].commentDiag.colorArrows[0]).to.be("Ye4e8")
        expect(my_res[0].commentDiag.colorArrows[1]).to.be("Gd1d3")
    })
    it("should understand clock annnotations", function () {
        // [ clg|egt|emt|mct  00:01:17 ]
        let my_res = parser.parse("c4 {[%clk 2:10:30]} Nf6 {[%egt 2:10:31]}")[0]
        expect(my_res[0].commentDiag).not.to.equal(null)
        expect(my_res[0].commentDiag.clock).to.be.ok()
        expect(my_res[1].commentDiag.clock).to.be.ok()
        expect(my_res[0].commentDiag.clock.type).to.be("clk")
        expect(my_res[0].commentDiag.clock.value).to.be("2:10:30")
        expect(my_res[1].commentDiag.clock.type).to.be("egt")
        expect(my_res[1].commentDiag.clock.value).to.be("2:10:31")
    })
})

describe("Parsing PGN game with all kinds of variation", function () {
    it("should read 1 variation", function () {
        let my_res = parser.parse("1. e4 e5 (1... c5 2. Nf3) 2. Nf3 Nc6")[0]
        expect(my_res.length).to.be(4)
        expect(my_res[0].variations.length).to.be(0)
        expect(my_res[1].variations.length).to.be(1)
        expect(my_res[1].variations[0].length).to.be(2)
        expect(my_res[1].variations[0][0].notation.notation).to.be("c5")
    })
    it("should read 1 variation at the first move", function () {
        let my_res = parser.parse("1. e4 (1. d4) 1... e5")[0]
        expect(my_res.length).to.be(2)
        expect(my_res[0].variations.length).to.be(1)
        expect(my_res[1].variations.length).to.be(0)
        expect(my_res[0].variations[0].length).to.be(1)
        expect(my_res[0].variations[0][0].notation.notation).to.be("d4")
    })
    it("should read many variation", function () {
        let my_res = parser.parse("1. e4 e5 (1... c5 2. Nf3) (1... c6) (e6) 2. Nf3 Nc6")[0]
        expect(my_res[1].variations.length).to.be(3)
        expect(my_res[1].variations[1][0].notation.notation).to.be("c6")
        expect(my_res[1].variations[2][0].notation.notation).to.be("e6")
    })
    it("should read hierarchical variation", function () {
        let my_res = parser.parse("1. e4 e5 (1... c5 2. Nf3 (2. d4? cxd4 3. Qxd4)) 2. Nf3 Nc6")[0]
        expect(my_res[1].variations[0][0].notation.notation).to.be("c5")
        expect(my_res[1].variations[0][1].variations[0][0].notation.notation).to.be("d4")
        expect(my_res[1].variations[0][1].variations[0][1].notation.notation).to.be("cxd4")
    })
})

describe("Parsing PGN game with different notations used", function () {
    it("should read SAN (short algebraic notation)", function () {
        let my_res = parser.parse("e4 d5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5 Nxf7 Bxf2+ Kxf2 Nxe4 Kg1 Qh4 Nxh8 Qf2#")[0]
        expect(my_res.length).to.be(16)
    })
    it("should read LAN (long algebraic notation)", function () {
        let my_res = parser.parse("e2-e4 e7-e5 Ng1-f3 Nb8-c6 Bf1-c4 Ng8-f6")[0]
        expect(my_res.length).to.be(6)
    })
    it("should read variants of LAN (long algebraic notation)", function () {
        let my_res = parser.parse("e2e4 e7xe5 g1-f3 b8c6 Bf1-c4 Ng8-f6")[0]
        expect(my_res.length).to.be(6)
    })
    it("should read short and long castling", function () {
        let my_res = parser.parse("1. O-O 2. O-O-O")[0]
        expect(my_res.length).to.be(2)
        expect(my_res[0].notation.notation).to.be("O-O")
        expect(my_res[1].notation.notation).to.be("O-O-O")
    })
})

describe("Parsing PGN game with all kinds of special move character", function () {

    it("should understand all sorts of additional notation (without NAGs and promotion)", function () {
        let my_res = parser.parse("1. e4+ dxe5 2. Nf3# Nc6+")[0]
        expect(my_res.length).to.be(4)
        expect(my_res[0].notation.notation).to.be("e4+")
        expect(my_res[0].notation.check).to.be("+")
        expect(my_res[1].notation.notation).to.be("dxe5")
        expect(my_res[1].notation.strike).to.be("x")
        expect(my_res[2].notation.notation).to.be("Nf3#")
        expect(my_res[2].notation.check).to.be("#")
    })
})

describe("Parsing PGN game with all kinds of NAGs", function () {
    it("should translate the standard NAGs to their canonical form", function () {
        let my_res = parser.parse("1. e4? e5! 2. d4?? d5!!")[0]
        expect(my_res.length).to.be(4)
        expect(my_res[0].nag).to.be.ok()
        expect(my_res[0].nag.length).to.be(1)
        expect(my_res[0].nag[0]).to.be('$2')
        expect(my_res[1].nag).to.be.ok()
        expect(my_res[1].nag.length).to.be(1)
        expect(my_res[1].nag[0]).to.be('$1')
        expect(my_res[2].nag).to.be.ok()
        expect(my_res[2].nag.length).to.be(1)
        expect(my_res[2].nag[0]).to.be('$4')
        expect(my_res[3].nag).to.be.ok()
        expect(my_res[3].nag.length).to.be(1)
        expect(my_res[3].nag[0]).to.be('$3')
    })
    it("should understand multiple NAGs", function () {
        let my_res = parser.parse("e4 $1$2$5 d5 $12 $23 $47")[0]
        expect(my_res.length).to.be(2)
        expect(my_res[0].nag.length).to.be(3)
        expect(my_res[0].nag[0]).to.be('$1')
        expect(my_res[0].nag[1]).to.be('$2')
        expect(my_res[0].nag[2]).to.be('$5')
        expect(my_res[1].nag.length).to.be(3)
        expect(my_res[1].nag[0]).to.be('$12')
        expect(my_res[1].nag[1]).to.be('$23')
        expect(my_res[1].nag[2]).to.be('$47')
    })
})

describe("Parsing PGN game with all kinds of promotions", function () {
    it("should understand all promotions for white and black", function () {
        let my_res = parser.parse("e4=Q e5=R f3=B c6=N c4 c5")[0]
        //let my_res = parser.parse("e4=Q e5=R f3=B c6=N c4=P c5=K")[0]
        expect(my_res.length).to.be(6)
        expect(my_res[0].notation.promotion).to.be('=Q')
        expect(my_res[1].notation.promotion).to.be('=R')
        expect(my_res[2].notation.promotion).to.be('=B')
        expect(my_res[3].notation.promotion).to.be('=N')
        expect(my_res[4].notation.promotion).not.to.be('=P')    // TODO: Don't allow this
        expect(my_res[5].notation.promotion).not.to.be('=K')    // TODO: Don't allow this
    })
    it("should throw an exception if promoting to king or pawn", function () {
        expect(function () { parser.parse("c8=P") } ).throwError()
        expect( function() { parser.parse("c8=K") }).throwError()
    })
})

describe("Parsing PGN game with all kinds of discriminators", function () {
    it("should detect discriminators", function () {
        let my_res = parser.parse("exg4 Nce5 B4f3")[0]
        expect(my_res.length).to.be(3)
        expect(my_res[0].notation.disc).to.be('e')
        expect(my_res[1].notation.disc).to.be('c')
        expect(my_res[2].notation.disc).to.be('4')
    })
})
