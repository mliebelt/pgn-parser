import parser = require("./_pgn-parser.js")

import {ParseTree, ParseTreeOrArray, PgnMove, PgnOptions} from "./types";

/**
 * General parse function, that accepts all `startRule`s. Calls then the more specific ones, so that the
 * postParse processing can now rely on the same structure all the time.
 */
export function parse(input: string, options: PgnOptions): ParseTreeOrArray {


    if (!options || (options.startRule === 'games')) {
        return parseGames(input, options)
    } else {
        return parseGame(input, options)
    }

}

export function parseGame(input: string, options: PgnOptions = {startRule: "game"}): ParseTree {
    input = input.trim()
    // Ensure that the correct structure exists: { tags: xxx, moves: ... }
    let result = parser.parse(input, options)
    if (options.startRule === "pgn") {
        result = {moves: result}
    } else if (options.startRule === "tags") {
        result = {tags: result}
    }
    return postParseGame(result, input, options)
}

function postParseGame(_parseTree: ParseTree, _input, _options) {
    /** Ensure that the result is kept as tag only, so no check of last move is necessary any more. */
    function handleGameResult(parseTree: ParseTree) {
        if (_options.startRule !== 'tags') {
            let move: PgnMove = parseTree.moves[parseTree.moves.length - 1];
            if (typeof move == 'string') {
                parseTree.moves.pop()
                if (parseTree.tags) {
                    parseTree.tags["Result"] = move
                }
            }
        }
        return parseTree
    }

    function handleTurn(parseResult: ParseTree) {
        function handleTurnGame(_game:ParseTree) {
            function getTurnFromFEN(fen) {
                return fen.split(/\s+/)[1];
            }

            function setTurn(_move, _currentTurn) {
                function switchTurn(currentTurn) {
                    return currentTurn === 'w' ? 'b' : 'w';
                }
                _move.turn = _currentTurn
                if (_move.variations) {
                    _move.variations.forEach(function (variation) {
                        let varTurn = _currentTurn
                        variation.forEach(varMove => varTurn = setTurn(varMove, varTurn))
                    })
                }
                return switchTurn(_currentTurn)
            }

            const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
            let fen = _options.fen || (_game.tags && _game.tags['FEN']) || START
            let currentTurn = getTurnFromFEN(fen)
            _game.moves.forEach(move => currentTurn = setTurn(move, currentTurn))
            return _game
        }

        if (! parseResult.moves) {
            return parseResult
        }
        return handleTurnGame(parseResult)
    }

    return handleTurn(handleGameResult(_parseTree))
}

export function parseGames(input, options: PgnOptions = {startRule: "games"}): ParseTree[] {
    function handleGamesAnomaly(parseTree: ParseTreeOrArray): ParseTree[] {
        if (!Array.isArray(parseTree)) return []
        if (parseTree.length === 0) return parseTree
        let last = parseTree.pop()
        if ((Object.keys(last.tags).length > 0) || (last.moves.length > 0)) {
            parseTree.push(last)
        }
        return parseTree
    }

    function postParseGames(parseTrees: ParseTree[], input: string, options: PgnOptions = {startRule: "games"}) {
        return handleGamesAnomaly(parseTrees)
    }

    const gamesOptions = Object.assign({startRule: "games"}, options);
    let result = <ParseTree[]>parser.parse(input, gamesOptions)
    if (!result) { return [] }
    postParseGames(result, input, gamesOptions)
    result.forEach((pt) => {
        postParseGame(pt, input, gamesOptions)
    })
    return result
}
