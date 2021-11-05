'use strict'

import parser = require("./_pgn-parser.js")

type StartRule = 'pgn' | 'game' | 'tags' | 'games'
type PgnOptions = { startRule: StartRule }
type ParseTree = { tags?: object, gameComment?: string, moves: PgnMove[], messages: string[]}
type PgnMove = { moveNumber: number,
                notation: { fig?: string | null, strike: 'x' | null, col: string, row: string, check: boolean, promotion: string | null, notation: string},
                variations: PgnMove[],
                nag: string | null,
                commentDiag: object,
                turn: 'w' | 'b'
}
/**
 * Patches the original function, to avoid empty games. May include additional functionality
 * for understanding parse errors later.
 */
export function parse(input: string, options: PgnOptions) {
    // Had to trim the grammar to allow no whitespace after a game, this is consumed only when read many games
    // Therefore the strings are trimmed here.
    if (! options || (options.startRule === 'pgn') || (options.startRule === "game")) {
        input = input.trim()
    }
    let result = parser.parse(input, options)

    function postParse(_parseTree: ParseTree, _input, _options) {
        /** Special cases are (resulting from the grammar)
         * <ul>
         *     <li>if `startRule === 'games'` ==> check last game, if it is empty</li>
         * </ul>
         * @param parseTree the result when parsing input
         * @returns {*[]|*}
         */
        function handleGamesAnomaly(parseTree:ParseTree | ParseTree[]) {
            if (_options && (_options.startRule === 'games')) {
                // result should be an array of games. Check the last game, if it is empty, and remove it then
                if (!Array.isArray(parseTree)) return []
                if (parseTree.length === 0) return parseTree
                let last = parseTree.pop()
                if ((Object.keys(last.tags).length > 0) || (last.moves.length > 0)) {
                    parseTree.push(last)
                }
            }
            return parseTree
        }
        /** Ensure that the result is kept as tag only, so no check of last move is necessary any more. */
        function handleGameResult(parseTree) {
            return parseTree
        }
        function handleTurn(parseResult) {
            function handleTurnGame(_game) {
                function getTurnFromFEN(fen) {
                    return fen.split(/\s+/)[1];
                }
                function setTurn(_move, _currentTurn) {
                    function switchTurn(currentTurn) {
                        return currentTurn === 'w' ? 'b' : 'w';
                    }
                    // if (typeof _move !== 'string') {
                    //     _move.turn = _currentTurn
                    // }
                    // See #99, ensure that this is not needed any more
                    _move.turn = _currentTurn
                    if (_move.variations) {
                        _move.variations.forEach(function(variation) {
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
            if (options.startRule === 'game') {
                return handleTurnGame(parseResult)
            } else if (options.startRule === 'pgn') {
                return handleTurnGame( { moves: parseResult} ).moves
            }
            if (options.startRule === 'games') {
                parseResult.forEach(game => handleTurnGame(game))

            }
            return parseResult
        }
        return handleTurn(handleGameResult(handleGamesAnomaly(_parseTree)))
    }

    return postParse(result, input, options)
}
