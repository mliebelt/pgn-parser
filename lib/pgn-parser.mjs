(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./_pgn-parser"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseGames = exports.parseGame = exports.parse = void 0;
    const parser = require("./_pgn-parser");
    /**
     * General parse function, that accepts all `startRule`s. Calls then the more specific ones, so that the
     * postParse processing can now rely on the same structure all the time.
     * @param input - the PGN string that will be parsed according to the `startRule` given
     * @param options - the parameters that have to include the `startRule`
     * @returns a ParseTree or an array of ParseTrees, depending on the startRule
     */
    function parse(input, options) {
        if (!options || (options.startRule === 'games')) {
            return parseGames(input, options);
        }
        else {
            return parseGame(input, options);
        }
    }
    exports.parse = parse;
    /**
     * Special parse function to parse one game only, options may be omitted.
     * @param input - the PGN string that will be parsed
     * @param options - object with additional parameters (not used at the moment)
     * @returns a ParseTree with the defined structure
     */
    function parseGame(input, options = { startRule: "game" }) {
        input = input.trim();
        // Ensure that the correct structure exists: { tags: xxx, moves: ... }
        let result = parser.parse(input, options);
        if (options.startRule === "pgn") {
            result = { moves: result };
        }
        else if (options.startRule === "tags") {
            result = { tags: result };
        }
        return postParseGame(result, input, options);
    }
    exports.parseGame = parseGame;
    function postParseGame(_parseTree, _input, _options) {
        /** Ensure that the result is kept as tag only, so no check of last move is necessary any more. */
        function handleGameResult(parseTree) {
            if (_options.startRule !== 'tags') {
                let move = parseTree.moves[parseTree.moves.length - 1];
                if (typeof move == 'string') {
                    parseTree.moves.pop();
                    if (parseTree.tags) {
                        let tmp = parseTree.tags["Result"];
                        if (tmp) {
                            if (move !== tmp) {
                                parseTree.messages.push({ key: "Result", value: tmp, message: "Result in tags is different to result in SAN" });
                            }
                        }
                        parseTree.tags["Result"] = move;
                    }
                }
            }
            return parseTree;
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
                    _move.turn = _currentTurn;
                    if (_move.variations) {
                        _move.variations.forEach(function (variation) {
                            let varTurn = _currentTurn;
                            variation.forEach(varMove => varTurn = setTurn(varMove, varTurn));
                        });
                    }
                    return switchTurn(_currentTurn);
                }
                const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
                let fen = _options.fen || (_game.tags && _game.tags['FEN']) || START;
                let currentTurn = getTurnFromFEN(fen);
                _game.moves.forEach(move => currentTurn = setTurn(move, currentTurn));
                return _game;
            }
            if (!parseResult.moves) {
                return parseResult;
            }
            return handleTurnGame(parseResult);
        }
        return handleTurn(handleGameResult(_parseTree));
    }
    /**
     * Parses possibly more than one game, therefore returns an array of ParseTree.
     * @param input the PGN string to parse
     * @param options the optional parameters (not used at the moment)
     * @returns an array of ParseTrees, one for each game included
     */
    function parseGames(input, options = { startRule: "games" }) {
        function handleGamesAnomaly(parseTree) {
            if (!Array.isArray(parseTree))
                return [];
            if (parseTree.length === 0)
                return parseTree;
            let last = parseTree.pop();
            if ((Object.keys(last.tags).length > 0) || (last.moves.length > 0)) {
                parseTree.push(last);
            }
            return parseTree;
        }
        function postParseGames(parseTrees, input, options = { startRule: "games" }) {
            return handleGamesAnomaly(parseTrees);
        }
        const gamesOptions = Object.assign({ startRule: "games" }, options);
        let result = parser.parse(input, gamesOptions);
        if (!result) {
            return [];
        }
        postParseGames(result, input, gamesOptions);
        result.forEach((pt) => {
            postParseGame(pt, input, gamesOptions);
        });
        return result;
    }
    exports.parseGames = parseGames;
});
