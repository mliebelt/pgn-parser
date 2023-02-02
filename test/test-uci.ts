import {parseGame} from "../src"
import should from 'should'
import {ParseTree} from "../src"
import {PgnMove, TagKeys} from "@mliebelt/pgn-types";
import assert = require("assert");

function parsePgn(string: string):PgnMove[] {
    return (<ParseTree>parseGame(string, {startRule: "pgn"})).moves
}

describe("When reading games in UCI/CSV format", function () {
    it("should handle the plain UCI format", function () {
        let res= parsePgn("c5c4 g3g7 g8g7 f5f6 g7f6 h5b5")
        should.exist(res)
    })
})