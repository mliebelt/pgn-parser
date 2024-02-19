import { suite } from 'uvu';
import assert from 'uvu/assert';
import {parseGame} from "../src"
import {ParseTree} from "../src"
import {PgnMove, TagKeys} from "@mliebelt/pgn-types";

const xtest = (exampleSkippedTest: string, p: () => void) => {};

function parsePgn(string: string):PgnMove[] {
    return (<ParseTree>parseGame(string, {startRule: "pgn"})).moves
}

const shouldAbleToSplitOneGame = suite("When reading games in UCI/CSV format")

shouldAbleToSplitOneGame("should handle the plain UCI format", function () {
    let res= parsePgn("c5c4 g3g7 g8g7 f5f6 g7f6 h5b5")
    assert.ok(res)
})

shouldAbleToSplitOneGame.run()