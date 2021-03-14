let parser = require("../pgn-parser.js");

let should = require('should');

describe("When working with PGN as string", function() {
    let my_result;
    describe("When having read the moves", function() {
        it("should have 16 half-moves read", function() {
            my_result =  parser.parse("1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e6 7. f3 Be7 8. Qd2 Qc7 ");
            let moves = my_result[0];
            should(moves.length).equal(16);
            const first = moves[0];
            const sec = moves[1];
            const seventh = moves[6];
            should(first.notation.notation).equal("e4");
            should(first.turn).equal('w');
            should(sec.turn).equal('b');
            //should(sec.moveNumber).toBeUndefined();
            should(seventh.moveNumber).equal(4);
            should(seventh.turn).equal('w');
            should(seventh.notation.notation).equal('Nxd4');
        })
    });
});

describe("When reading complete game starting with the first move", function () {
    it("should notice white starting and color switching each move", function () {
        let my_res = parser.parse("1. e4 e5 2. Nf3")[0];
        should(my_res.length).equal(3);
        should(my_res[0].turn).equal("w");
        should(my_res[1].turn).equal("b");
        should(my_res[2].turn).equal("w");
    })
    // This is not possible due to the lax interpretation of PGN with move numbers
    // This has to be corrected by the reader later, that has a position as well.
    // it("should notice black starting and other colors for moves", function () {
    //     let my_res = parser.parse("1... e5 2. Nf3")[0];
    //     should(my_res.length).equal(2);
    //     should(my_res[0].turn).equal("b");
    //     should(my_res[1].turn).equal("w");
    // })
    it("should read all kind of move numbers without problems", function () {
        let my_res = parser.parse("1... e4 1... e5 2.. d4 2 . d5 f4 3. f5") [0]
        should(my_res.length).equal(6)
        should(my_res[0].turn).equal("w")
        should(my_res[0].notation.notation).equal("e4")
        should(my_res[0].moveNumber).equal(1)
        should(my_res[1].moveNumber).equal(1)
        should(my_res[2].moveNumber).equal(2)
        should(my_res[3].moveNumber).equal(2)
        should(my_res[4].moveNumber).equal(null)
        should(my_res[5].moveNumber).equal(3)
    })
})

describe("When a game notes a result at the end", function () {
    it("should have the result as last entry of the array", function () {
        let my_res = parser.parse("1. e4 1:0")[0]
        should(my_res.length).equal(2)
        should(my_res[1]).equal("1:0")
    })
    it("should have all kinds or result: 1:0", function () {
        let my_res = parser.parse("1. e4 1:0")[0]
        should(my_res[1]).equal("1:0")
    })
    it("should have all kinds or result: 0:1", function () {
        let my_res = parser.parse("1. e4 0:1")[0]
        should(my_res[1]).equal("0:1")
    })
    it("should have all kinds or result: 1-0", function () {
        let my_res = parser.parse("1. e4 1-0")[0]
        should(my_res[1]).equal("1-0")
    })
    it("should have all kinds or result: 0-1", function () {
        let my_res = parser.parse("1. e4 0-1")[0]
        should(my_res[1]).equal("0-1")
    })
    it("should have all kinds or result: 1/2-1/2", function () {
        let my_res = parser.parse("1. e4  1/2-1/2")[0]
        should(my_res[1]).equal("1/2-1/2")
    })
    it("should have all kinds or result: *", function () {
        let my_res = parser.parse("1. e4  *")[0]
        should(my_res[1]).equal("*")
    })
    it("should ignore additional white space before or after", function () {
        let my_res = parser.parse("1. e4     *    ")[0]
        should(my_res[1]).equal("*")
    })
    it("should ignore additional white space before or after success", function () {
        let my_res = parser.parse("1. e4    1:0    ")[0]
        should(my_res[1]).equal("1:0")
    })
    it("should ignore 1 space before or after", function () {
        let my_res = parser.parse("27. Ng2 Qxg2# 0-1 ")[0]
        should(my_res[2]).equal("0-1")
    })
    it("should handle variation at the end", function () {
        let my_res = parser.parse("1. e4 (1. d4) 1/2-1/2")[0]
        should(my_res[1]).equal("1/2-1/2")
    })
    it("should handle variation at the end even for wins", function () {
        let my_res = parser.parse("1. e4 (1. d4) 1:0")[0]
        should(my_res[1]).equal("1:0")
    })
    it("should handle variation at the end even for wins with different format", function () {
        let my_res = parser.parse("1. e4 (1. d4) 1-0")[0]
        should(my_res[1]).equal("1-0")
    })
    it("should handle variation at the end even for unclear results", function () {
        let my_res = parser.parse("1. e4 (1. d4) *")[0]
        should(my_res[1]).equal("*")
    })
})

describe("Reading PGN game with all kinds of comments", function () {
    it("should read comments at all locations", function () {
        let my_res = parser.parse("{First} 1. e4 {third} e5! {fourth}")[0]
        should(my_res.length).equal(2)
        should(my_res[0].commentMove).equal("First")
        should(my_res[0].commentAfter).equal("third")
        should(my_res[1].commentAfter).equal("fourth")
    })
    it("should read 2 comments in one location", function () {
        let my_res = parser.parse("1. e4 {first} {second} e5!")[0]
        should(my_res.length).equal(2)
        should(my_res[0].commentAfter).equal("first second")
    })

    it("should read 3 comments in one location", function () {
        let my_res = parser.parse("1. e4 {first} {second} {third} e5!")[0]
        should(my_res.length).equal(2)
        should(my_res[0].commentAfter).equal("first second third")
    })

    it("should read many comment and annotations in one location", function () {
        let my_res = parser.parse("1. e4 {first} {[%cal Re4e6] [%csl Rd4]} e5!")[0]
        should(my_res.length).equal(2)
        should(my_res[0].commentAfter).equal("first")
        should(my_res[0].commentDiag.colorArrows[0]).equal("Re4e6")
        should(my_res[0].commentDiag.colorFields[0]).equal("Rd4")
    })
    it("should read additional whitespace when reading comments (according to the spec)", function () {
        let my_res = parser.parse("  {First  } 1....    e4   {  third  } e5! {    fourth  }   ")[0]
        should(my_res.length).equal(2)
        should(my_res[0].commentAfter).equal("  third  ")
        should(my_res[1].commentAfter).equal("    fourth  ")
    })
    it("should understand comment annotations: fields", function () {
        let my_res = parser.parse("1. e4 {[%csl Ye4,Rd4,Ga1,Bh1]}")[0]
        should(my_res[0].commentDiag).not.equal(null)
        should.exist(my_res[0].commentDiag.colorFields)
        should(my_res[0].commentDiag.colorFields[0]).equal("Ye4")
        should(my_res[0].commentDiag.colorFields[1]).equal("Rd4")
        should(my_res[0].commentDiag.colorFields[2]).equal("Ga1")
        should(my_res[0].commentDiag.colorFields[3]).equal("Bh1")
    })
    it("should understand comment annotations: arrows", function () {
        let my_res = parser.parse("1. e4 {[%cal Ye4e8,Rd4a4,Ga1h8,Bh1c7]}")[0]
        should.exist(my_res[0].commentDiag)
        should.exist(my_res[0].commentDiag.colorArrows)
        should(my_res[0].commentDiag.colorArrows[0]).equal("Ye4e8")
        should(my_res[0].commentDiag.colorArrows[1]).equal("Rd4a4")
        should(my_res[0].commentDiag.colorArrows[2]).equal("Ga1h8")
        should(my_res[0].commentDiag.colorArrows[3]).equal("Bh1c7")
    })
    it("should understand combination of comment and arrows", function () {
        let my_res = parser.parse("1. e4 { [%cal Ye4e8] comment}")[0]
        should.exist(my_res[0].commentDiag)
        should.exist(my_res[0].commentDiag.colorArrows)

        should(my_res[0].commentAfter).equal(" comment")
        should(my_res[0].commentDiag.colorArrows[0]).equal("Ye4e8")
    })
    it("should understand combination of comment, arrows and fields", function () {
        let my_res = parser.parse("1. e4 { [%cal Ye4e8] [%csl Rd4] comment }")[0]
        should.exist(my_res[0].commentDiag)
        should.exist(my_res[0].commentDiag.colorArrows)
        should.exist(my_res[0].commentDiag.colorFields)

        should(my_res[0].commentAfter).equal(" comment ")
        should(my_res[0].commentDiag.colorArrows[0]).equal("Ye4e8")
        should(my_res[0].commentDiag.colorFields[0]).equal("Rd4")
    })
    it("should understand combination of comment, arrows and fields with a comment", function () {
        let my_res = parser.parse("1. e4 { comment1 } { [%cal Ye4e8] [%csl Rd4] comment2 }")[0]
        should.exist(my_res[0].commentDiag)
        should.exist(my_res[0].commentDiag.colorArrows)
        should.exist(my_res[0].commentDiag.colorFields)
        should.exist(my_res[0].commentAfter)

        should(my_res[0].commentAfter).equal(" comment1 comment2 ")
        should(my_res[0].commentDiag.colorArrows[0]).equal("Ye4e8")
        should(my_res[0].commentDiag.colorFields[0]).equal("Rd4")
    })
    it("should understand combination of comment, arrows and fields, and comment again", function () {
        // Currently not supported, order of normal comments  and arrows / fields is restricted.
        let my_res = parser.parse("1. e4 { comment1 } { [%cal Ye4e8] [%csl Rd4] } { comment2 }")[0]
        should.exist(my_res[0].commentDiag)
        should.exist(my_res[0].commentDiag.colorArrows)
        should.exist(my_res[0].commentDiag.colorFields)
        should.exist(my_res[0].commentAfter)

        should(my_res[0].commentAfter).equal(" comment1 comment2 ")
        should(my_res[0].commentDiag.colorArrows[0]).equal("Ye4e8")
        should(my_res[0].commentDiag.colorFields[0]).equal("Rd4")
    })
    it("should understand permutations of comment, arrows and fields", function () {
        let my_res = parser.parse("1. e4 { [%csl Rd4] [%cal Ye4e8] comment }")[0]
        should.exist(my_res[0].commentDiag)
        should.exist(my_res[0].commentDiag.colorArrows)
        should.exist(my_res[0].commentDiag.colorFields)

        should(my_res[0].commentAfter).equal(" comment ")
        should(my_res[0].commentDiag.colorArrows[0]).equal("Ye4e8")
        should(my_res[0].commentDiag.colorFields[0]).equal("Rd4")
    })
    it("should understand combination of fields and arrows", function () {
        let my_res = parser.parse("1. e4 { [%cal Ye4e8] [%csl Rd4] }")[0]
        should.exist(my_res[0].commentDiag)
        should.exist(my_res[0].commentDiag.colorFields)
        should.exist(my_res[0].commentDiag.colorArrows)
        should(my_res[0].commentDiag.colorFields[0]).equal("Rd4")
        should(my_res[0].commentDiag.colorArrows[0]).equal("Ye4e8")
    })
    it("should understand permutations of fields and arrows", function () {
        let my_res = parser.parse("1. e4 { [%csl Rd4] [%cal Ye4e8]  }")[0]
        should.exist(my_res[0].commentDiag)
        should.exist(my_res[0].commentDiag.colorFields)
        should.exist(my_res[0].commentDiag.colorArrows)
        should(my_res[0].commentDiag.colorFields[0]).equal("Rd4")
        should(my_res[0].commentDiag.colorArrows[0]).equal("Ye4e8")
    })
    it("should understand whitespace when adding fields and arrows", function () {
        let my_res = parser.parse("1. e4 { [%csl   Rd4 ] [%cal   Ye4e8  ,  Gd1d3]  }")[0]
        should.exist(my_res[0].commentDiag)
        should.exist(my_res[0].commentDiag.colorFields)
        should.exist(my_res[0].commentDiag.colorArrows)
        should(my_res[0].commentDiag.colorFields[0]).equal("Rd4")
        should(my_res[0].commentDiag.colorArrows[0]).equal("Ye4e8")
        should(my_res[0].commentDiag.colorArrows[1]).equal("Gd1d3")
    })
    // Does not meet the supplement specification, which requires (at least) one whitespace
    xit("should understand lack of whitespace when adding fields and arrows", function () {
        let my_res = parser.parse("1. e4 { [%cslRd4] [%calYe4e8,Gd1d3] }")[0]
        should.exist(my_res[0].commentDiag)
        should.exist(my_res[0].commentDiag.colorFields)
        should.exist(my_res[0].commentDiag.colorArrows)
        should(my_res[0].commentDiag.colorFields[0]).equal("Rd4")
        should(my_res[0].commentDiag.colorArrows[0]).equal("Ye4e8")
        should(my_res[0].commentDiag.colorArrows[1]).equal("Gd1d3")
    })
    it("should understand one clock annotation per move", function () {
        // [ clk|egt|emt|mct  00:01:17 ]
        let my_res = parser.parse("c4 {[%clk 2:10:30]} Nf6 {[%egt 2:10:31]}")[0]
        should.exist(my_res[0].commentDiag)
        should(my_res[0].commentDiag["clk"]).equal("2:10:30")
        should(my_res[1].commentDiag["egt"]).equal("2:10:31")
    })
    // Not allowed due to the spec
    xit("should understand clock annotations without whitespace", function () {
        let my_res = parser.parse("c4 {[%clk2:10:30]} Nf6 {[%egt2:10:31]}")[0]
        should.exist(my_res[0].commentDiag)
        should(my_res[0].commentDiag["clk"]).equal("2:10:30")
        should(my_res[1].commentDiag["egt"]).equal("2:10:31")
    })
    it("should understand many clock annotations in one move only", function () {
        let my_res = parser.parse("c4 {[%clk 0:10:10] [%egt 0:10:10] [%emt 0:08:08] [%mct 1:10:11]}")[0]
        should.exist(my_res[0].commentDiag)
        should(my_res[0].commentDiag["clk"]).equal("0:10:10")
        should(my_res[0].commentDiag["egt"]).equal("0:10:10")
        should(my_res[0].commentDiag["emt"]).equal("0:08:08")
        should(my_res[0].commentDiag["mct"]).equal("1:10:11")
    })
    it("should understand mix of clock comments and normal comments", function () {
        let my_res = parser.parse("c4 {Start [%clk 0:10:10] comment [%egt 0:10:10] up to end}")[0]
        should.exist(my_res[0].commentDiag)
        should(my_res[0].commentDiag["clk"]).equal("0:10:10")
        should(my_res[0].commentDiag["egt"]).equal("0:10:10")
        should(my_res[0].commentAfter).equal("Start comment up to end")
    })
    it("should understand mix of clock comment and other annotation comment", function () {
        let my_res = parser.parse("1. e4 { First move } { [%cal Gd2d4] } { [%clk 0:02:00] }")[0]
        should.exist(my_res[0].commentDiag)
        should(my_res[0].commentDiag["clk"]).equal("0:02:00")
        should(my_res[0].commentDiag.colorArrows[0]).equal("Gd2d4")
        should(my_res[0].commentAfter).equal(" First move ")
    })
    it("should understand end-of-line comment", function () {
        let input = `c4 ; This is ignored up to end of line
c5 Nf3`
        let my_res = parser.parse(input)[0]
        should(my_res.length).equal(3)
        should(my_res[0].commentAfter).equal(" This is ignored up to end of line")
    })
    it("should parse both eol and normal comments", function () {
        let input = `c4 { normal } c5;symmetrical move
Nf3 Nf6 { black stays symmetric }`
        let my_res = parser.parse(input)[0]
        should(my_res.length).equal(4)
        should(my_res[0].commentAfter).equal(" normal ")
        should(my_res[1].commentAfter).equal("symmetrical move")
        should(my_res[3].commentAfter).equal(" black stays symmetric ")
    })
    it("should ignore in eol comment all other characters, even comments", function () {
        let input = `c3 ; ignore other comments like { comment } and ; eol comment
c6 {strange moves}`
        let my_res = parser.parse(input)[0]
        should(my_res.length).equal(2)
        should(my_res[0].commentAfter).equal(" ignore other comments like { comment } and ; eol comment")
    })
    it("should ignore an eol comment inside a normal comment", function () {
        let input = `c3 { start; not an eol comment
does this work?? } c6`
        let my_res = parser.parse(input)[0]
        should(my_res.length).equal(2)
        should(my_res[0].commentAfter).equal(" start; not an eol comment\ndoes this work?? ")
    })
})

describe("Parsing PGN game with all kinds of variation", function () {
    it("should read 1 variation", function () {
        let my_res = parser.parse("1. e4 e5 (1... c5 2. Nf3) 2. Nf3 Nc6")[0]
        should(my_res.length).equal(4)
        should(my_res[0].variations.length).equal(0)
        should(my_res[1].variations.length).equal(1)
        should(my_res[1].variations[0].length).equal(2)
        should(my_res[1].variations[0][0].notation.notation).equal("c5")
    })
    it("should read 1 variation at the first move", function () {
        let my_res = parser.parse("1. e4 (1. d4) 1... e5")[0]
        should(my_res.length).equal(2)
        should(my_res[0].variations.length).equal(1)
        should(my_res[1].variations.length).equal(0)
        should(my_res[0].variations[0].length).equal(1)
        should(my_res[0].variations[0][0].notation.notation).equal("d4")
    })
    it("should read many variation", function () {
        let my_res = parser.parse("1. e4 e5 (1... c5 2. Nf3) (1... c6) (e6) 2. Nf3 Nc6")[0]
        should(my_res[1].variations.length).equal(3)
        should(my_res[1].variations[1][0].notation.notation).equal("c6")
        should(my_res[1].variations[2][0].notation.notation).equal("e6")
    })
    it("should read hierarchical variation", function () {
        let my_res = parser.parse("1. e4 e5 (1... c5 2. Nf3 (2. d4? cxd4 3. Qxd4)) 2. Nf3 Nc6")[0]
        should(my_res[1].variations[0][0].notation.notation).equal("c5")
        should(my_res[1].variations[0][1].variations[0][0].notation.notation).equal("d4")
        should(my_res[1].variations[0][1].variations[0][1].notation.notation).equal("cxd4")
    })
})

describe("Parsing PGN game with different notations used", function () {
    it("should read SAN (short algebraic notation)", function () {
        let my_res = parser.parse("e4 d5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5 Nxf7 Bxf2+ Kxf2 Nxe4 Kg1 Qh4 Nxh8 Qf2#")[0]
        should(my_res.length).equal(16)
    })
    it("should read LAN (long algebraic notation)", function () {
        let my_res = parser.parse("e2-e4 e7-e5 Ng1-f3 Nb8-c6 Bf1-c4 Ng8-f6")[0]
        should(my_res.length).equal(6)
    })
    it("should read variants of LAN (long algebraic notation)", function () {
        let my_res = parser.parse("e2e4 e7xe5 g1-f3 b8c6 Bf1-c4 Ng8-f6")[0]
        should(my_res.length).equal(6)
    })
    it("should read short and long castling", function () {
        let my_res = parser.parse("1. O-O 2. O-O-O")[0]
        should(my_res.length).equal(2)
        should(my_res[0].notation.notation).equal("O-O")
        should(my_res[1].notation.notation).equal("O-O-O")
    })
})

describe("Parsing PGN game with all kinds of special move character", function () {

    it("should understand all sorts of additional notation (without NAGs and promotion)", function () {
        let my_res = parser.parse("1. e4+ dxe5 2. Nf3# Nc6+")[0]
        should(my_res.length).equal(4)
        should(my_res[0].notation.notation).equal("e4+")
        should(my_res[0].notation.check).equal("+")
        should(my_res[1].notation.notation).equal("dxe5")
        should(my_res[1].notation.strike).equal("x")
        should(my_res[2].notation.notation).equal("Nf3#")
        should(my_res[2].notation.check).equal("#")
    })
})

describe("Parsing PGN game with all kinds of NAGs", function () {
    it("should translate the standard NAGs to their canonical form", function () {
        let my_res = parser.parse("1. e4? e5! 2. d4?? d5!!")[0]
        should(my_res.length).equal(4)
        should.ok(my_res[0].nag)
        should(my_res[0].nag.length).equal(1)
        should(my_res[0].nag[0]).equal('$2')
        should.ok(my_res[1].nag)
        should(my_res[1].nag.length).equal(1)
        should(my_res[1].nag[0]).equal('$1')
        should(my_res[2].nag).ok()
        should(my_res[2].nag.length).equal(1)
        should(my_res[2].nag[0]).equal('$4')
        should.ok(my_res[3].nag)
        should(my_res[3].nag.length).equal(1)
        should(my_res[3].nag[0]).equal('$3')
    })
    it("should understand multiple NAGs", function () {
        let my_res = parser.parse("e4 $1$2$5 d5 $12 $23 $47")[0]
        should(my_res.length).equal(2)
        should(my_res[0].nag.length).equal(3)
        should(my_res[0].nag[0]).equal('$1')
        should(my_res[0].nag[1]).equal('$2')
        should(my_res[0].nag[2]).equal('$5')
        should(my_res[1].nag.length).equal(3)
        should(my_res[1].nag[0]).equal('$12')
        should(my_res[1].nag[1]).equal('$23')
        should(my_res[1].nag[2]).equal('$47')
    })
})

describe("Parsing PGN game with all kinds of promotions", function () {
    it("should understand all promotions for white and black", function () {
        let my_res = parser.parse("e4=Q e5=R f3=B c6=N c4 c5")[0]
        //let my_res = parser.parse("e4=Q e5=R f3=B c6=N c4=P c5=K")[0]
        should(my_res.length).equal(6)
        should(my_res[0].notation.promotion).equal('=Q')
        should(my_res[1].notation.promotion).equal('=R')
        should(my_res[2].notation.promotion).equal('=B')
        should(my_res[3].notation.promotion).equal('=N')
        should(my_res[4].notation.promotion).not.equal('=P')
        should(my_res[5].notation.promotion).not.equal('=K')
    })
    it("should throw an exception if promoting to king or pawn", function () {
        should(function () { parser.parse("c8=P") } ).throwError()
        should( function() { parser.parse("c8=K") }).throwError()
    })
})

describe("Parsing PGN game with all kinds of discriminators", function () {
    it("should detect discriminators", function () {
        let my_res = parser.parse("exg4 Nce5 B4f3")[0]
        should(my_res.length).equal(3)
        should(my_res[0].notation.disc).equal('e')
        should(my_res[1].notation.disc).equal('c')
        should(my_res[2].notation.disc).equal('4')
    })
})

describe("Just examples of complex notations or errors of the past", function () {
    it("should be useful in the documentation", function () {
        let my_res = parser.parse("1. e4! {my favorite} e5 (1... c5!?)")
    })
    it("should check error #25", function () {
        let my_res = parser.parse("1. e4 (1. d4) 1-0")
        should.exist(my_res)
    })
    it("should check error #36 first example", function () {
        should(function () {
            parser.parse("1. . .")
        }).throw()
        let my_res = parser.parse("1..... e4")[0]
        should.exist(my_res)
        should(my_res[0].moveNumber).equal(1)
        my_res = parser.parse("1     ..... e4")[0]
        should.exist(my_res)
        should(my_res[0].moveNumber).equal(1)
    })
})
