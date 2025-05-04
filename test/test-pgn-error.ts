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

// Handling of errors
function parseError(content: string, errorHint: string) {
  assert.throws(
    () => parseGame(content),
    (err: any) => {
      assert.is(err.name, "SyntaxError");
      assert.is(err.errorHint, errorHint);
      return true;
    },
  );
}

const errorHandling = suite("Handle errors in a correct way");
errorHandling("Has additional errorHint when getting a parse error", function () {
  parseError("aaa", "Error at line 1, column 2:\n1: a**aa");
});
errorHandling("Tags and pgn parsing", function () {
  const input = `[SetUp "1"]
[FEN "r1b1k1nr/pppp3p/2n3p1/8/4q3/2Q2N2/PP3PPP/R1B1K2R w - - 0 1"]

1. K d1 Qd5+ *`;
  const expected = 'Error at line 4, column 5:\n2: [FEN "r1b1k1nr/pppp3p/2n3p1/8/4q3/2Q2N2/PP3PPP/R1B1K2R w - - 0 1"]\n3: \n4: 1. K** d1 Qd5+ *';
  parseError(input, expected);
});

errorHandling.run();
