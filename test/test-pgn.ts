import { test, suite } from "uvu";
import assert from "uvu/assert";
import { parseGame } from "../src";
import { ParseTree } from "../src";
import { TagKeys, PgnMove } from "@mliebelt/pgn-types";
import { getInputFileNameFromOutput } from "ts-loader/dist/instances";

const xtest = (exampleSkippedTest: string, p: () => void) => {};
function parsePgn(string: string): PgnMove[] {
  return (<ParseTree>parseGame(string, { startRule: "pgn" })).moves;
}

let tag = function (pt: ParseTree, tag: TagKeys): string {
  if (!pt.tags) {
    return "";
  }
  if (pt.tags && pt.tags[tag]) {
    return pt.tags[tag];
  }
  return "";
};

const completeWithFirst = suite("When reading complete game starting with the first move");
completeWithFirst("should notice white starting and color switching each move", function () {
  let my_res = parsePgn("1. e4 e5 2. Nf3");
  assert.is(my_res.length, 3);
  assert.is(my_res[0].turn, "w");
  assert.is(my_res[1].turn, "b");
  assert.is(my_res[2].turn, "w");
});
// This is not possible due to the lax interpretation of PGN with move numbers
// This has to be corrected by the reader later, that has a position as well.
// it("should notice black starting and other colors for moves", function () {
//     let my_res = parsePgn("1... e5 2. Nf3")[0];
//     assert.is(my_res.length,2) ;
//     assert.is(my_res[0].turn,"b") ;
//     assert.is(my_res[1].turn,"w") ;
// })
completeWithFirst("should read all kind of move numbers without problems", function () {
  let my_res = parsePgn("1... e4 1... e5 2.. d4 2 . d5 f4 3. f5");
  assert.is(my_res.length, 6);
  assert.is(my_res[0].notation.notation, "e4");
  assert.is(my_res[0].moveNumber, 1);
  assert.is(my_res[1].moveNumber, 1);
  assert.is(my_res[2].moveNumber, 2);
  assert.is(my_res[3].moveNumber, 2);
  assert.is(my_res[4].moveNumber, null);
  assert.is(my_res[5].moveNumber, 3);
});
/* See the comments on https://github.com/mliebelt/pgn-parser/issues/463# to get the context. That is
 * valid from the grammar point of view, so this test is commented out.
 */
// completeWithFirst("should flag an error when move number is not an integer followed by a dot", function () {
xtest("should flag an error when move number is not an integer followed by a dot", function () {
  // let my_res = parsePgn("aa1. e4")
  let my_res = parseGame("1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 aa10. d4 Nbd7");
  assert.is(my_res.moves.length, 20); // Current result is 21, due to the additional move aa1
});
completeWithFirst.run();

const gameWithResult = suite("When a game notes a result at the end");
gameWithResult("should have the result as Result in tags", function () {
  let my_res = parseGame("1. e4 1-0");
  assert.is(my_res.moves.length, 1);
  assert.is(tag(my_res, "Result"), "1-0");
});
gameWithResult("should have all kinds or result: 1-0", function () {
  let my_res = parseGame("1. e4 1-0");
  assert.is(tag(my_res, "Result"), "1-0");
});
gameWithResult("should have all kinds or result: 0-1", function () {
  let my_res = parseGame("1. e4 0-1");
  assert.is(tag(my_res, "Result"), "0-1");
});
gameWithResult("should have all kinds or result: 1/2-1/2", function () {
  let my_res = parseGame("1. e4  1/2-1/2");
  assert.is(tag(my_res, "Result"), "1/2-1/2");
});
gameWithResult("should have all kinds or result: *", function () {
  let my_res = parseGame("1. e4  *");
  assert.is(tag(my_res, "Result"), "*");
});
gameWithResult("should ignore additional white space before or after", function () {
  let my_res = parseGame("1. e4     *    ");
  assert.is(tag(my_res, "Result"), "*");
});
gameWithResult("should ignore additional white space before or after success", function () {
  let my_res = parseGame("1. e4    1-0    ");
  assert.is(tag(my_res, "Result"), "1-0");
});
gameWithResult("should ignore 1 space before or after", function () {
  let my_res = parseGame("27. Ng2 Qxg2# 0-1 ");
  assert.is(tag(my_res, "Result"), "0-1");
});
gameWithResult("should handle variation at the end", function () {
  let my_res = parseGame("1. e4 (1. d4) 1/2-1/2");
  assert.is(tag(my_res, "Result"), "1/2-1/2");
});
gameWithResult("should handle variation at the end even for wins", function () {
  let my_res = parseGame("1. e4 (1. d4) 1-0");
  assert.is(tag(my_res, "Result"), "1-0");
});
gameWithResult("should handle variation at the end even for wins with different format", function () {
  let my_res = parseGame("1. e4 (1. d4) 1-0");
  assert.is(tag(my_res, "Result"), "1-0");
});
gameWithResult("should handle variation at the end even for unclear results", function () {
  let my_res = parseGame("1. e4 (1. d4) *");
  assert.is(tag(my_res, "Result"), "*");
});
gameWithResult.run();

const gameWithComments = suite("Reading PGN game with all kinds of comments");
gameWithComments("should read empty comments without problems", function () {
  let my_res = parsePgn("1. e4 {} e5");
  assert.is(my_res.length, 2);
});
gameWithComments("should read errornous pgn from #349", function () {
  let my_res = parseGame('[Setup "1"] [FEN "4r1k1/1q3ppp/p7/8/Q3r3/8/P4PPP/R3R1K1 w - - 0 1"] 1. Qxe8+ {} Rxe8 2. Rxe8# *');
  assert.is(my_res.moves.length, 3);
  assert.is(my_res.moves[0].commentAfter, undefined);
});
gameWithComments("should read comments at all locations", function () {
  let my_res = parsePgn("{First} 1. e4 {third} e5! {fourth}");
  assert.is(my_res.length, 2);
  assert.is(my_res[0].commentMove, "First");
  assert.is(my_res[0].commentAfter, "third");
  assert.is(my_res[1].commentAfter, "fourth");
});
gameWithComments("should read 2 comments in one location", function () {
  let my_res = parsePgn("1. e4 {first} {second} e5!");
  assert.is(my_res.length, 2);
  assert.is(my_res[0].commentAfter, "first second");
});

gameWithComments("should read 3 comments in one location", function () {
  let my_res = parsePgn("1. e4 {first} {second} {third} e5!");
  assert.is(my_res.length, 2);
  assert.is(my_res[0].commentAfter, "first second third");
});

gameWithComments("should read many comment and annotations in one location", function () {
  let my_res = parsePgn("1. e4 {first} {[%cal Re4e6] [%csl Rd4]} e5!");
  assert.is(my_res.length, 2);
  assert.is(my_res[0].commentAfter, "first");
  let arrows = my_res[0].commentDiag?.colorArrows || [];
  let fields = my_res[0].commentDiag?.colorFields || [];
  assert.is(arrows[0], "Re4e6");
  assert.is(fields[0], "Rd4");
});
gameWithComments("should read additional whitespace when reading comments (according to the spec)", function () {
  let my_res = parsePgn("  {First  } 1....    e4   {  third  } e5! {    fourth  }   ");
  assert.is(my_res.length, 2);
  assert.is(my_res[0].commentAfter, "  third  ");
  assert.is(my_res[1].commentAfter, "    fourth  ");
});
gameWithComments("should understand comment annotations: fields", function () {
  let my_res = parsePgn("1. e4 {[%csl Ye4,Rd4,Ga1,Bh1,Oe1,Cb1]}");
  assert.is.not(my_res[0].commentDiag, null);
  assert.ok(my_res[0].commentDiag.colorFields);
  let fields = my_res[0].commentDiag?.colorFields || [];
  assert.is(fields[0], "Ye4");
  assert.is(fields[1], "Rd4");
  assert.is(fields[2], "Ga1");
  assert.is(fields[3], "Bh1");
  assert.is(fields[4], "Oe1");
  assert.is(fields[5], "Cb1");
});
gameWithComments("should understand comment annotations: arrows", function () {
  let my_res = parsePgn("1. e4 {[%cal Ye4e8,Rd4a4,Ga1h8,Bh1c7,Oc1c7,Ch1h7]}");
  assert.ok(my_res[0].commentDiag);
  let arrows = my_res[0].commentDiag?.colorArrows || [];
  assert.ok(my_res[0].commentDiag.colorArrows);
  assert.is(arrows[0], "Ye4e8");
  assert.is(arrows[1], "Rd4a4");
  assert.is(arrows[2], "Ga1h8");
  assert.is(arrows[3], "Bh1c7");
  assert.is(arrows[4], "Oc1c7");
  assert.is(arrows[5], "Ch1h7");
});
gameWithComments("should understand combination of comment and arrows", function () {
  let my_res = parsePgn("1. e4 { [%cal Ye4e8] comment}");
  assert.ok(my_res[0].commentDiag);
  assert.ok(my_res[0].commentDiag.colorArrows);

  assert.is(my_res[0].commentAfter, "comment");
  let arrows = my_res[0].commentDiag?.colorArrows || [];
  assert.is(arrows[0], "Ye4e8");
});
gameWithComments("should understand empty comments (cal)", function () {
  let my_res = parsePgn("1. e4{[%csl Ge5][%cal ]}");
  assert.ok(my_res[0].commentDiag);
  assert.ok(my_res[0].commentDiag.colorFields);
});
gameWithComments("should understand empty comments (csl)", function () {
  let my_res = parsePgn("1. e4{[%csl ][%cal Ye4e8]}");
  assert.ok(my_res[0].commentDiag);
  assert.ok(my_res[0].commentDiag.colorArrows);
});
gameWithComments("should understand empty comments (csl and cal)", function () {
  let my_res = parsePgn("1. e4{[%csl ][%cal ]}");
  assert.ok(my_res[0].commentDiag);
});
gameWithComments("should understand combination of comment, arrows and fields", function () {
  let my_res = parsePgn("1. e4 { [%cal Ye4e8] [%csl Rd4] comment }");
  assert.ok(my_res[0].commentDiag);
  assert.ok(my_res[0].commentDiag.colorArrows);
  assert.ok(my_res[0].commentDiag.colorFields);

  assert.is(my_res[0].commentAfter, "comment ");
  let arrows = my_res[0].commentDiag?.colorArrows || [];
  let fields = my_res[0].commentDiag?.colorFields || [];
  assert.is(arrows[0], "Ye4e8");
  assert.is(fields[0], "Rd4");
});
gameWithComments("should understand combination of comment, arrows and fields with a comment", function () {
  let my_res = parsePgn("1. e4 { comment1 } { [%cal Ye4e8] [%csl Rd4] comment2 }");
  assert.ok(my_res[0].commentDiag);
  assert.ok(my_res[0].commentDiag.colorArrows);
  assert.ok(my_res[0].commentDiag.colorFields);
  assert.ok(my_res[0].commentAfter);

  assert.is(my_res[0].commentAfter, " comment1 comment2 ");
  let arrows = my_res[0].commentDiag?.colorArrows || [];
  let fields = my_res[0].commentDiag?.colorFields || [];
  assert.is(arrows[0], "Ye4e8");
  assert.is(fields[0], "Rd4");
});
gameWithComments("should understand combination of comment, arrows and fields, and comment again", function () {
  // Currently not supported, order of normal comments  and arrows / fields is restricted.
  let my_res = parsePgn("1. e4 { comment1 } { [%cal Ye4e8] [%csl Rd4] } { comment2 }");
  assert.ok(my_res[0].commentDiag);
  assert.ok(my_res[0].commentDiag.colorArrows);
  assert.ok(my_res[0].commentDiag.colorFields);
  assert.ok(my_res[0].commentAfter);
  let arrows = my_res[0].commentDiag?.colorArrows || [];
  let fields = my_res[0].commentDiag?.colorFields || [];
  assert.is(my_res[0].commentAfter, " comment1 comment2 ");
  assert.is(arrows[0], "Ye4e8");
  assert.is(fields[0], "Rd4");
});
gameWithComments("should understand permutations of comment, arrows and fields", function () {
  let my_res = parsePgn("1. e4 { [%csl Rd4] [%cal Ye4e8] comment }");
  assert.ok(my_res[0].commentDiag);
  assert.ok(my_res[0].commentDiag.colorArrows);
  assert.ok(my_res[0].commentDiag.colorFields);

  assert.is(my_res[0].commentAfter, "comment ");
  let arrows = my_res[0].commentDiag?.colorArrows || [];
  let fields = my_res[0].commentDiag?.colorFields || [];
  assert.is(arrows[0], "Ye4e8");
  assert.is(fields[0], "Rd4");
});
gameWithComments("should understand combination of fields and arrows", function () {
  let my_res = parsePgn("1. e4 { [%cal Ye4e8] [%csl Rd4] }");
  assert.ok(my_res[0].commentDiag);
  assert.ok(my_res[0].commentDiag.colorFields);
  assert.ok(my_res[0].commentDiag.colorArrows);
  let arrows = my_res[0].commentDiag?.colorArrows || [];
  let fields = my_res[0].commentDiag?.colorFields || [];
  assert.is(fields[0], "Rd4");
  assert.is(arrows[0], "Ye4e8");
});
gameWithComments("should understand permutations of fields and arrows", function () {
  let my_res = parsePgn("1. e4 { [%csl Rd4] [%cal Ye4e8]  }");
  assert.ok(my_res[0].commentDiag);
  assert.ok(my_res[0].commentDiag.colorFields);
  assert.ok(my_res[0].commentDiag.colorArrows);
  let arrows = my_res[0].commentDiag?.colorArrows || [];
  let fields = my_res[0].commentDiag?.colorFields || [];
  assert.is(fields[0], "Rd4");
  assert.is(arrows[0], "Ye4e8");
});
gameWithComments("should understand whitespace when adding fields and arrows", function () {
  let my_res = parsePgn("1. e4 { [%csl   Rd4 ] [%cal   Ye4e8  ,  Gd1d3]  }");
  assert.ok(my_res[0].commentDiag);
  assert.ok(my_res[0].commentDiag.colorFields);
  assert.ok(my_res[0].commentDiag.colorArrows);
  let arrows = my_res[0].commentDiag?.colorArrows || [];
  let fields = my_res[0].commentDiag?.colorFields || [];
  assert.is(fields[0], "Rd4");
  assert.is(arrows[0], "Ye4e8");
  assert.is(arrows[1], "Gd1d3");
});
gameWithComments("should understand game comment with arrows", function () {
  let res = parseGame("{ [%cal Ge2e4,Ge2g4,Ge2c4] } e4");
  assert.ok(res);
  assert.ok(res.gameComment?.colorArrows);
  assert.is(res.gameComment?.colorArrows?.length, 3);
});
// Does not meet the supplement specification, which requires (at least) one whitespace
// gameWithComments("should understand lack of whitespace when adding fields and arrows", function () {
xtest("should understand lack of whitespace when adding fields and arrows", function () {
  let my_res = parsePgn("1. e4 { [%cslRd4] [%calYe4e8,Gd1d3] }");
  assert.ok(my_res[0].commentDiag);
  assert.ok(my_res[0].commentDiag.colorFields);
  assert.ok(my_res[0].commentDiag.colorArrows);
  let arrows = my_res[0].commentDiag?.colorArrows || [];
  let fields = my_res[0].commentDiag?.colorFields || [];
  assert.is(fields[0], "Rd4");
  assert.is(arrows[0], "Ye4e8");
  assert.is(arrows[1], "Gd1d3");
});
gameWithComments("should understand one clock annotation per move", function () {
  // [ clk|egt|emt|mct  00:01:17 ]
  let my_res = parsePgn("c4 {[%clk 2:10:30]} Nf6 {[%egt 2:10:31]}");
  assert.ok(my_res[0].commentDiag);
  assert.is(my_res[0].commentDiag["clk"], "2:10:30");
  assert.is(my_res[1].commentDiag["egt"], "2:10:31");
});
// Not allowed due to the spec
// gameWithComments("should understand clock annotations without whitespace", function () {
xtest("should understand clock annotations without whitespace", function () {
  let my_res = parsePgn("c4 {[%clk2:10:30]} Nf6 {[%egt2:10:31]}");
  assert.ok(my_res[0].commentDiag);
  assert.is(my_res[0].commentDiag["clk"], "2:10:30");
  assert.is(my_res[1].commentDiag["egt"], "2:10:31");
});
gameWithComments("should understand many clock annotations in one move only", function () {
  let my_res = parsePgn("c4 {[%clk 0:10:10] [%egt 0:10:10] [%emt 0:08:08] [%mct 1:10:11]}");
  assert.ok(my_res[0].commentDiag);
  assert.is(my_res[0].commentDiag["clk"], "0:10:10");
  assert.is(my_res[0].commentDiag["egt"], "0:10:10");
  assert.is(my_res[0].commentDiag["emt"], "0:08:08");
  assert.is(my_res[0].commentDiag["mct"], "1:10:11");
});
gameWithComments("should understand mix of clock comments and normal comments", function () {
  let my_res = parsePgn("c4 {Start [%clk 0:10:10] comment [%egt 0:10:10] up to end}");
  assert.ok(my_res[0].commentDiag);
  assert.is(my_res[0].commentDiag["clk"], "0:10:10");
  assert.is(my_res[0].commentDiag["egt"], "0:10:10");
  assert.is(my_res[0].commentAfter, "Start comment up to end");
});
gameWithComments("should understand mix of clock comment and other annotation comment", function () {
  let my_res = parsePgn("1. e4 { First move } { [%cal Gd2d4] } { [%clk 0:02:00] }");
  assert.ok(my_res[0].commentDiag);
  assert.is(my_res[0].commentDiag["clk"], "0:02:00");
  let arrows = my_res[0].commentDiag?.colorArrows || [];
  assert.is(arrows[0], "Gd2d4");
  assert.is(my_res[0].commentAfter, " First move ");
});
gameWithComments("should understand end-of-line comment", function () {
  let input = `c4 ; This is ignored up to end of line
c5 Nf3`;
  let my_res = parsePgn(input);
  assert.is(my_res.length, 3);
  assert.is(my_res[0].commentAfter, " This is ignored up to end of line");
});
gameWithComments("should parse both eol and normal comments", function () {
  let input = `c4 { normal } c5;symmetrical move
Nf3 Nf6 { black stays symmetric }`;
  let my_res = parsePgn(input);
  assert.is(my_res.length, 4);
  assert.is(my_res[0].commentAfter, " normal ");
  assert.is(my_res[1].commentAfter, "symmetrical move");
  assert.is(my_res[3].commentAfter, " black stays symmetric ");
});
gameWithComments("should ignore in eol comment all other characters, even comments", function () {
  let input = `c3 ; ignore other comments like { comment } and ; eol comment
c6 {strange moves}`;
  let my_res = parsePgn(input);
  assert.is(my_res.length, 2);
  assert.is(my_res[0].commentAfter, " ignore other comments like { comment } and ; eol comment");
});
gameWithComments("should ignore an eol comment inside a normal comment", function () {
  let input = `c3 { start; not an eol comment
does this work?? } c6`;
  let my_res = parsePgn(input);
  assert.is(my_res.length, 2);
  assert.is(my_res[0].commentAfter, " start; not an eol comment\ndoes this work?? ");
});
gameWithComments("should keep commands it cannot parse inside comments", function () {
  let my_res = parsePgn("1. e4 { [%foo 1.0] [%bar any,string] }");
  assert.is(my_res.length, 1);
  let commentDiag = <object>my_res[0].commentDiag;
  assert.is(commentDiag["foo"], "1.0");
  assert.is(commentDiag["bar"], "any,string");
});
gameWithComments("should keep commands sprinkled in comments it cannot parse", function () {
  let my_res = parsePgn("1. e4 { [%foo 1.0] } { [%bar any,string] }");
  assert.is(my_res.length, 1);
  let commentDiag = <object>my_res[0].commentDiag;
  assert.is(commentDiag["foo"], "1.0");
  assert.is(commentDiag["bar"], "any,string");
});
gameWithComments("should keep commands it cannot parse, read diag comments", function () {
  let my_res = parsePgn("1. e4 { [%foo 1.0] } { [%clk 0:02:00] }");
  assert.is(my_res.length, 1);
  let commentDiag = <object>my_res[0].commentDiag;
  assert.is(commentDiag["foo"], "1.0");
  assert.is(my_res[0].commentDiag.clk, "0:02:00");
});
gameWithComments("should ignore commands it cannot parse inside comments, but read other comments", function () {
  let my_res = parsePgn("1. e4 { first comment [%foo 1.0] second comment [%bar any,string] }");
  assert.is(my_res.length, 1);
  let commentDiag = <object>my_res[0].commentDiag;
  assert.is(commentDiag["foo"], "1.0");
  assert.is(commentDiag["bar"], "any,string");
  assert.is(my_res[0].commentAfter, " first comment second comment");
});
gameWithComments("should read eval command", function () {
  let my_res = parsePgn("1. e4 { [%eval -1.02] }");
  assert.is(my_res.length, 1);
  assert.is(my_res[0].commentDiag.eval, -1.02);
});
gameWithComments("should read comment from issue #203 (of PgnViewerJS)", function () {
  let input = "1. d4 d5 2. Nf3 { Here black & white look good }";
  let my_res = parsePgn(input)[0];
  assert.ok(my_res);
});
gameWithComments("should read action comments, and avoid text comment on only whitespace", function () {
  let my_res = parsePgn("e5 { [%csl Gf6] }");
  assert.ok(my_res);
  let fields = my_res[0].commentDiag?.colorFields || [];
  assert.is(fields.length, 1);
  assert.is(fields[0], "Gf6");
  assert.is(my_res[0].commentAfter, undefined);
});
gameWithComments("should read unknown action comments", function () {
  let my_res = parsePgn("1. d4 {[%depth20 +0.35] [%depth1 +0.34]} Nf6 {[%depth20 +0.24] [%depth1 +0.13]}");
  assert.ok(my_res);
  assert.is(my_res[0].commentDiag["depth20"], "+0.35");
  assert.is(my_res[1].commentDiag["depth1"], "+0.13");
});
gameWithComments("should read action comment with underscore (#362)", function () {
  let my_res = parsePgn("1. e4 e5 2. Nf3 Nc6 3. d4 Nf6 { [%c_effect f6;square;f6;type;Inaccuracy;persistent;true] } 4. dxe5");
  assert.ok(my_res);
  assert.is(my_res[5].commentDiag["c_effect"], "f6;square;f6;type;Inaccuracy;persistent;true");
});
gameWithComments.run();

const clockCommands = suite("Parsing PGN with clockCommands with unusual format");
clockCommands("should emmit messages for mct with 1 hour digit", function () {
  let my_res = parseGame("e5 { [%mct 1:10:42] }");
  assert.ok(my_res);
  assert.is(my_res.moves[0].commentDiag["mct"], "1:10:42");
  assert.is(my_res.messages[0].message, "Only 2 digits for hours normally used");
});
clockCommands("should emmit messages for egt, emt, clk with 2 hour digit", function () {
  let my_res = parseGame("e5 { [%egt 01:10:42] }");
  assert.ok(my_res);
  assert.is(my_res.moves[0].commentDiag["egt"], "01:10:42");
  assert.is(my_res.messages[0].message, "Only 1 digit for hours normally used");
  my_res = parseGame("e5 { [%emt 01:10:42] }");
  assert.ok(my_res);
  assert.is(my_res.moves[0].commentDiag["emt"], "01:10:42");
  assert.is(my_res.messages[0].message, "Only 1 digit for hours normally used");
  my_res = parseGame("e5 { [%clk 01:10:42] }");
  assert.ok(my_res);
  assert.is(my_res.moves[0].commentDiag["clk"], "01:10:42");
  assert.is(my_res.messages[0].message, "Only 1 digit for hours normally used");
});
clockCommands("should emmit a message for incomplete 1 hour digit commands: only seconds", function () {
  let my_res = parseGame("e5 { [%emt 42] }");
  assert.ok(my_res);
  assert.is(my_res.moves[0].commentDiag["emt"], "42");
  assert.is(my_res.messages[0].message, "Hours and minutes missing");
});
clockCommands("should emmit a message for incomplete 1 hour digit commands: hours missing", function () {
  let my_res = parseGame("e5 { [%emt 12:42] }");
  assert.ok(my_res);
  assert.is(my_res.moves[0].commentDiag["emt"], "12:42");
  assert.is(my_res.messages[0].message, "No hours found");
});
clockCommands("should emmit a message for incomplete 1 hour digit commands: 1 digit minutes", function () {
  let my_res = parseGame("e5 { [%emt 2:42] }");
  assert.ok(my_res);
  assert.is(my_res.moves[0].commentDiag["emt"], "2:42");
  assert.is(my_res.messages[0].message, "No hours found");
});
clockCommands("should emmit a message for use of millis", function () {
  let my_res = parseGame("e5 {[%clk 0:00:59.8]}");
  assert.ok(my_res);
  assert.is(my_res.moves[0].commentDiag["clk"], "0:00:59.8");
  assert.is(my_res.messages[0].message, "Unusual use of millis in clock value");
});
clockCommands.run();

const parsingVariations = suite("Parsing PGN game with all kinds of variation");
parsingVariations("should read 1 variation", function () {
  let my_res = parsePgn("1. e4 e5 (1... c5 2. Nf3) 2. Nf3 Nc6");
  assert.is(my_res.length, 4);
  assert.is(my_res[0].variations.length, 0);
  assert.is(my_res[1].variations.length, 1);
  assert.is(my_res[1].variations[0].length, 2);
  assert.is(my_res[1].variations[0][0].notation.notation, "c5");
});
parsingVariations("should read 1 variation at the first move", function () {
  let my_res = parsePgn("1. e4 (1. d4) 1... e5");
  assert.is(my_res.length, 2);
  assert.is(my_res[0].variations.length, 1);
  assert.is(my_res[1].variations.length, 0);
  assert.is(my_res[0].variations[0].length, 1);
  assert.is(my_res[0].variations[0][0].notation.notation, "d4");
});
parsingVariations("should read many variation", function () {
  let my_res = parsePgn("1. e4 e5 (1... c5 2. Nf3) (1... c6) (e6) 2. Nf3 Nc6");
  assert.is(my_res[1].variations.length, 3);
  assert.is(my_res[1].variations[1][0].notation.notation, "c6");
  assert.is(my_res[1].variations[2][0].notation.notation, "e6");
});
parsingVariations("should read hierarchical variation", function () {
  let my_res = parsePgn("1. e4 e5 (1... c5 2. Nf3 (2. d4? cxd4 3. Qxd4)) 2. Nf3 Nc6");
  assert.is(my_res[1].variations[0][0].notation.notation, "c5");
  assert.is(my_res[1].variations[0][1].variations[0][0].notation.notation, "d4");
  assert.is(my_res[1].variations[0][1].variations[0][1].notation.notation, "cxd4");
});
parsingVariations.run();

const parsingDifferentNotations = suite("Parsing PGN game with different notations used");
parsingDifferentNotations("should read SAN (short algebraic notation)", function () {
  let my_res = parsePgn("e4 d5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5 Nxf7 Bxf2+ Kxf2 Nxe4 Kg1 Qh4 Nxh8 Qf2#");
  assert.is(my_res.length, 16);
});
parsingDifferentNotations("should read LAN (long algebraic notation)", function () {
  let my_res = parsePgn("e2-e4 e7-e5 Ng1-f3 Nb8-c6 Bf1-c4 Ng8-f6");
  assert.is(my_res.length, 6);
});
parsingDifferentNotations("should read variants of LAN (long algebraic notation)", function () {
  let my_res = parsePgn("e2e4 e7xe5 g1-f3 b8c6 Bf1-c4 Ng8-f6");
  assert.is(my_res.length, 6);
});
parsingDifferentNotations("should read short and long castling", function () {
  let my_res = parsePgn("1. O-O 2. O-O-O");
  assert.is(my_res.length, 2);
  assert.is(my_res[0].notation.notation, "O-O");
  assert.is(my_res[1].notation.notation, "O-O-O");
});
parsingDifferentNotations.run();

const parsingMoveNumbers = suite("Parsing PGN game with all kinds of move numbers in it");

parsingMoveNumbers("should parse no move numbers", function () {
  let my_res = parsePgn("e4 e5 Nf3 Nc6");
  assert.is(my_res.length, 4);
  assert.is(my_res[0].notation.notation, "e4");
});
parsingMoveNumbers("should parse normal move numbers", function () {
  let my_res = parsePgn("1. e4 e5 2. Nf3 Nc6");
  assert.is(my_res.length, 4);
  assert.is(my_res[0].notation.notation, "e4");
});
parsingMoveNumbers("should parse additional move numbers without a problem", function () {
  let my_res = parsePgn("1. e4 1. e5 2. Nf3 2. Nc6");
  assert.is(my_res.length, 4);
  assert.is(my_res[0].notation.notation, "e4");
});
parsingMoveNumbers("should parse move numbers with additional dots and whitespaces", function () {
  let my_res = parsePgn("1... e4 1.....     e5 2......     Nf3 2   .... Nc6");
  assert.is(my_res.length, 4);
  assert.is(my_res[0].notation.notation, "e4");
});
parsingMoveNumbers("should parse move numbers with wrong move number with dots and whitespaces", function () {
  let my_res = parsePgn("1. ... e4 1 e5 2 Nf3 2.  ... Nc6");
  assert.is(my_res.length, 4);
  assert.is(my_res[0].notation.notation, "e4");
});
parsingMoveNumbers.run();

const parsingSpecialMoveCharacter = suite("Parsing PGN game with all kinds of special move character");

parsingSpecialMoveCharacter("should understand all sorts of additional notation (without NAGs and promotion)", function () {
  let my_res = parsePgn("1. e4+ dxe5 2. Nf3# Nc6+");
  assert.is(my_res.length, 4);
  assert.is(my_res[0].notation.notation, "e4+");
  assert.is(my_res[0].notation.check, "+");
  assert.is(my_res[1].notation.notation, "dxe5");
  assert.is(my_res[1].notation.strike, "x");
  assert.is(my_res[2].notation.notation, "Nf3#");
  assert.is(my_res[2].notation.check, "#");
});
parsingSpecialMoveCharacter.run();

const parsingNAGs = suite("Parsing PGN game with all kinds of NAGs");
parsingNAGs("should translate the standard NAGs to their canonical form", function () {
  let my_res = parsePgn("1. e4? e5! 2. d4?? d5!!");
  assert.is(my_res.length, 4);
  assert.ok(my_res[0].nag);
  assert.is(my_res[0].nag.length, 1);
  assert.is(my_res[0].nag[0], "$2");
  assert.ok(my_res[1].nag);
  assert.is(my_res[1].nag.length, 1);
  assert.is(my_res[1].nag[0], "$1");
  assert.ok(my_res[2].nag);
  assert.is(my_res[2].nag.length, 1);
  assert.is(my_res[2].nag[0], "$4");
  assert.ok(my_res[3].nag);
  assert.is(my_res[3].nag.length, 1);
  assert.is(my_res[3].nag[0], "$3");
});
parsingNAGs("should understand multiple NAGs", function () {
  let my_res = parsePgn("e4 $1$2$5 d5 $12 $23 $47");
  assert.is(my_res.length, 2);
  assert.is(my_res[0].nag.length, 3);
  assert.is(my_res[0].nag[0], "$1");
  assert.is(my_res[0].nag[1], "$2");
  assert.is(my_res[0].nag[2], "$5");
  assert.is(my_res[1].nag.length, 3);
  assert.is(my_res[1].nag[0], "$12");
  assert.is(my_res[1].nag[1], "$23");
  assert.is(my_res[1].nag[2], "$47");
});
parsingNAGs.run();

const parsingPromotions = suite("Parsing PGN game with all kinds of promotions");
parsingPromotions("should understand all promotions for white and black", function () {
  let my_res = parsePgn("e4=Q e5=R f3=B c6=N c4 c5");
  //let my_res = parsePgn("e4=Q e5=R f3=B c6=N c4=P c5=K")
  assert.is(my_res.length, 6);
  assert.is(my_res[0].notation.promotion, "=Q");
  assert.is(my_res[1].notation.promotion, "=R");
  assert.is(my_res[2].notation.promotion, "=B");
  assert.is(my_res[3].notation.promotion, "=N");
  assert.is.not(my_res[4].notation.promotion, "=P");
  assert.is.not(my_res[5].notation.promotion, "=K");
});
parsingPromotions("should throw an exception if promoting to king or pawn", function () {
  assert.throws(function () {
    parsePgn("c8=P");
  });
  assert.throws(function () {
    parsePgn("c8=K");
  });
});
parsingPromotions("should allow promotion with and without '=' sign", function () {
  let my_res = parsePgn("e4Q e5R f3B c6N c4 c5");
  //let my_res = parsePgn("e4=Q e5=R f3=B c6=N c4=P c5=K")
  assert.is(my_res.length, 6);
  assert.is(my_res[0].notation.promotion, "=Q");
  assert.is(my_res[1].notation.promotion, "=R");
  assert.is(my_res[2].notation.promotion, "=B");
  assert.is(my_res[3].notation.promotion, "=N");
  assert.is.not(my_res[4].notation.promotion, "=P");
  assert.is.not(my_res[5].notation.promotion, "=K");
});
parsingPromotions.run();

const parsingDiscriminators = suite("Parsing PGN game with all kinds of discriminators");
parsingDiscriminators("should detect discriminators", function () {
  let my_res = parsePgn("exg4 Nce5 B4f3");
  assert.is(my_res.length, 3);
  assert.is(my_res[0].notation.disc, "e");
  assert.is(my_res[1].notation.disc, "c");
  assert.is(my_res[2].notation.disc, "4");
});
parsingDiscriminators.run();

const followLawsOfChess = suite("Parsing PGN games which follow 'Laws of Chess'");
followLawsOfChess("should allow 'e.p.' in the notation", function () {
  let my_res = parsePgn("exd6 e.p.");
  assert.is(my_res.length, 1);
  assert.is(my_res[0].notation.notation, "exd6");
});
followLawsOfChess.run();

const complexOrErrors = suite("Just examples of complex notations or errors of the past");
complexOrErrors("should be useful in the documentation", function () {
  let my_res = parsePgn("1. e4! {my favorite} e5 (1... c5!?)");
  assert.ok(my_res);
});
complexOrErrors("should check error #25", function () {
  let my_res = parsePgn("1. e4 (1. d4) 1-0");
  assert.ok(my_res);
});
complexOrErrors("should check error #36 first example: mix of spaces and dots", function () {
  const errFunc = () => {
    parsePgn("1. . .");
  };
  assert.throws(errFunc, Error);
  let my_res = parsePgn("1..... e4");
  assert.ok(my_res);
  assert.is(my_res[0].moveNumber, 1);
  my_res = parsePgn("1     ..... e4");
  assert.ok(my_res);
  assert.is(my_res[0].moveNumber, 1);
});
complexOrErrors("should allow alternative syntax for catching exceptions", () => {
  assert.throws(
    () => parsePgn("1. . ."),
    (err: any) => {
      assert.is(err.name, "SyntaxError");
      assert.is(err.message, 'Expected "-", "O-O", "O-O-O", "Z0", "x", [RNBQKP], [a-h], or whitespace but "." found.');
      console.log(err.errorHint);
      return true;
    },
  );
});
complexOrErrors("should understand error #195 (PgnViewerJS): last comment direct before ending", function () {
  let my_res = parsePgn(
    "1. e4 { [%clk 0:03:00] } 1... Nf6 { [%clk 0:03:00] } 2. e5 { [%clk 0:02:59] } 2... Nd5 { [%clk 0:03:00] } 3. d4 { [%clk 0:02:58] } 3... d6 { [%clk 0:02:59] } { B03 Alekhine Defense } 4. f4 { [%clk 0:02:56] } 4... dxe5 { [%clk 0:02:59] } 5. fxe5 { [%clk 0:02:55] } 5... Bf5 { [%clk 0:02:58] } 6. Nf3 { [%clk 0:02:54] } 6... Nc6 { [%clk 0:02:58] } 7. Bc4 { [%clk 0:02:52] } 7... e6 { [%clk 0:02:57] } 8. O-O { [%clk 0:02:49] } 8... Ncb4 { [%clk 0:02:54] } 9. Bg5 { [%clk 0:02:45] } 9... f6 { [%clk 0:02:52] } 10. exf6 { [%clk 0:02:44] } 10... gxf6 { [%clk 0:02:52] } 11. Bh4 { [%clk 0:02:37] } 11... Nxc2 { [%clk 0:02:50] } 12. Re1 { [%clk 0:02:24] } 12... Nxa1 { [%clk 0:02:48] } 13. Nc3 { [%clk 0:02:20] } 13... Nxc3 { [%clk 0:02:26] } 14. Qxa1 { [%clk 0:02:12] } 14... Nd5 { [%clk 0:02:24] } 15. Qd1 { [%clk 0:01:52] } 15... Be7 { [%clk 0:02:12] } 16. Nd2 { [%clk 0:01:39] } 16... Qd7 { [%clk 0:01:56] } 17. Qh5+ { [%clk 0:01:37] } 17... Bg6 { [%clk 0:01:53] } 18. Qg4 { [%clk 0:01:28] } 18... Bf5 { [%clk 0:01:45] } 19. Qh5+ { [%clk 0:01:26] } 19... Bg6 { [%clk 0:01:42] } 20. Qg4 { [%clk 0:01:25] } 20... Bf7 { [%clk 0:01:34] } 21. Qg7 { [%clk 0:00:45] } 21... Rg8 { [%clk 0:01:26] } 22. Qxh7 { [%clk 0:00:44] } 22... O-O-O { [%clk 0:01:25] } 23. Ne4 { [%clk 0:00:31] } 23... Bg6 { [%clk 0:01:21] } 24. Qh6 { [%clk 0:00:22] } 24... Bxe4 { [%clk 0:01:16] } 25. Rxe4 { [%clk 0:00:19] } 25... Bd6 { [%clk 0:01:06] } 26. Qxf6 { [%clk 0:00:17] } 26... Rde8 { [%clk 0:01:00] } 27. Qf3 { [%clk 0:00:13] } 27... Nb6 { [%clk 0:00:56] } 28. Bb3 { [%clk 0:00:11] } 28... Qb5 { [%clk 0:00:49] } 29. Rxe6 { [%clk 0:00:06] } 29... Ref8 { [%clk 0:00:42] } 30. Qh3 { [%clk 0:00:04] } 30... Rf1# { [%clk 0:00:41] } { Black wins by checkmate. } 0-1",
  );
  assert.ok(my_res);
});
complexOrErrors("should understand error #309: included escaped doublequote", function () {
  let my_res = parseGame('[Event "Bg7 in the Sicilian: 2.Nf3 d6 3.Bc4 - The \\"Closed\\" Dragon"]*');
  assert.ok(my_res);
  assert.ok(my_res.tags?.Event);
  assert.is(tag(my_res, "Event"), 'Bg7 in the Sicilian: 2.Nf3 d6 3.Bc4 - The "Closed" Dragon');
});
complexOrErrors("should handle BOM on the beginning of games", function () {
  let res = parsePgn("\uFEFF1. Qxe8+ {} Rxe8 2. Rxe8# *\n");
  assert.ok(res);
  assert.is(res.length, 3);
});
complexOrErrors.run();

const parsingNullMoves = suite("Parsing pgn notation with null moves");
parsingNullMoves("should allow null moves (notation: Z0) inserted", function () {
  let res: PgnMove[] = parsePgn("1. e4 e5 2. Z0 Nc6 3. Z0 Nf6");
  assert.ok(res);
  assert.is(res.length, 6);
  assert.is(res[2].notation.notation, "Z0");
  assert.is(res[4].notation.notation, "Z0");
});
parsingNullMoves("should allow null moves (notation: --) inserted", function () {
  let res: PgnMove[] = parsePgn("1. e4 e5 2. -- Nc6 3. -- Nf6");
  assert.ok(res);
  assert.is(res.length, 6);
  assert.is(res[2].notation.notation, "Z0");
  assert.is(res[4].notation.notation, "Z0");
});
parsingNullMoves.run();

const parsingCrazyhouse = suite("Parsing Crazyhouse notation");
parsingCrazyhouse("should understand drop notation", function () {
  let my_res = parsePgn("12... B@e7 {[%clk 0:00:45]}");
  assert.ok(my_res);
  assert.ok(my_res[0].notation);
  let move = my_res[0].notation;
  assert.is(move.fig, "B");
  assert.is(move.col, "e");
  assert.is(move.row, "7");
  assert.is(move.drop, true);
  assert.is(move.notation, "B@e7");
});
parsingCrazyhouse.run();

const postProcessing = suite("When doing post processing of one game (only pgn)");
postProcessing("should handle turn correct", function () {
  let my_res = parsePgn("1. e4 e5");
  assert.ok(my_res);
  assert.is(my_res[0].turn, "w");
  assert.is(my_res[1].turn, "b");
});
postProcessing("should handle turn correct for black with fen", function () {
  let my_res = (<ParseTree>parseGame("2... Nc6 3. d4", {
    startRule: "pgn",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
  })).moves;
  assert.ok(my_res);
  assert.is(my_res[0].turn, "b");
  assert.is(my_res[1].turn, "w");
});
postProcessing("should handle turn correct for white with fen", function () {
  let my_res = (<ParseTree>parseGame("3. d4 exd4", {
    startRule: "pgn",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
  })).moves;
  assert.ok(my_res);
  assert.is(my_res[0].turn, "w");
  assert.is(my_res[1].turn, "b");
});
postProcessing("should understand all variations well", function () {
  let my_res = parsePgn("1. e4 e5 ( 1... d5 2. exd5 Qxd5 ) ( 1... c5 2. Nf3 d6 ) 2. Nf3");
  assert.ok(my_res);
  assert.is(my_res[1].variations[0][0].turn, "b");
  assert.is(my_res[1].variations[0][1].turn, "w");
  assert.is(my_res[1].variations[0][2].turn, "b");
  assert.is(my_res[1].variations[1][0].turn, "b");
  assert.is(my_res[1].variations[1][1].turn, "w");
  assert.is(my_res[1].variations[1][2].turn, "b");
});
postProcessing.run();
