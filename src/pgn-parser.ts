// import PegParser = require("./_pgn-parser")
// import * as PegParser from './_pgn-parser'

import PegParser from "./_pgn-parser.js";
// const SyntaxError = require("./_pgn-parser").SyntaxError;
//import { SyntaxError } from "./_pgn-parser-types"
import { ParseTree, PgnOptions, Turn } from "./types";
import { PgnMove, Tags } from "@mliebelt/pgn-types";

/**
 * General parse function, that accepts all `startRule`s. Calls then the more specific ones, so that the
 * postParse processing can now rely on the same structure all the time.
 * @param input - the PGN string that will be parsed according to the `startRule` given
 * @param options - the parameters that have to include the `startRule`
 * @returns a ParseTree or an array of ParseTrees, depending on the startRule
 */
export function parse(input: string, options: PgnOptions): ParseTree | ParseTree[] | PgnMove[] | Tags {
  if (!options || options.startRule === "games") {
    return parseGames(input, options);
  } else {
    return parseGame(input, options);
  }
}

/**
 * Special parse function to parse one game only, options may be omitted.
 * @param input - the PGN string that will be parsed
 * @param options - object with additional parameters (not used at the moment)
 * @returns a ParseTree with the defined structure
 */
export function parseGame(input: string, options: PgnOptions = { startRule: "game" }): ParseTree {
  try {
    input = input.trim();
    // Ensure that the correct structure exists: { tags: xxx, moves: ... }
    let result = PegParser.parse(input, options);
    let res2: ParseTree = { moves: [] as PgnMove[], messages: [] };
    if (options.startRule === "pgn") {
      res2.moves = result;
    } else if (options.startRule === "tags") {
      res2.tags = result;
    } else {
      res2 = result;
    }
    return postParseGame(res2, input, options);
  } catch (error) {
    // error will be enhanced, so throw the returning error object
    throw parseError(input, options, error);
  }
}

/**
 * Handles parsing errors and enhances the error object with a detailed error hint.
 * @param input - the PGN string that was being parsed
 * @param options - the parsing options that were used
 * @param error - the error that occurred during parsing
 * @returns the enhanced error object
 */
function parseError(input: string, options: PgnOptions, error: any): any {
  // Check if the error contains location information
  if (error.location && error.location.start) {
    const line = error.location.start.line;
    const column = error.location.start.column;

    // Split the input into lines
    const lines = input.split("\n");

    // Create context with a few lines before and after the error
    const contextStart = Math.max(0, line - 3);
    const contextEnd = Math.min(lines.length, line + 2);
    const contextLines: string[] = [];

    for (let i = contextStart; i < contextEnd; i++) {
      const lineNum = i + 1;
      let lineContent = lines[i] || "";

      // If this is the error line, mark the error position
      if (lineNum === line) {
        if (column <= lineContent.length) {
          // Insert ** before the character at the error position
          lineContent = lineContent.substring(0, column - 1) + "**" + lineContent.substring(column - 1);
        } else {
          // Error is at the end of the line
          lineContent += "**";
        }
      }

      contextLines.push(`${lineNum}: ${lineContent}`);
    }

    // Create the error hint
    error.errorHint = `Error at line ${line}, column ${column}:\n${contextLines.join("\n")}`;
  } else {
    // If no location info is available, provide a basic message
    error.errorHint = `Error parsing PGN (no location information available): ${error.message || "Unknown error"}`;
  }

  return error;
}

function postParseGame(_parseTree: ParseTree, _input: string, _options: { startRule: string } & PgnOptions) {
  /** Ensure that the result is kept as tag only, so no check of last move is necessary any more. */
  function handleGameResult(parseTree: ParseTree) {
    if (_options.startRule !== "tags") {
      let move: PgnMove = parseTree.moves[parseTree.moves.length - 1];
      if (typeof move == "string") {
        parseTree.moves.pop();
        if (parseTree.tags) {
          let tmp = parseTree.tags["Result"];
          if (tmp) {
            if (move !== tmp) {
              parseTree.messages.push({
                key: "Result",
                value: tmp,
                message: "Result in tags is different to result in SAN",
              });
            }
          }
          parseTree.tags["Result"] = move;
        }
      }
    }
    return parseTree;
  }

  function handleTurn(parseResult: ParseTree) {
    function handleTurnGame(_game: ParseTree) {
      function getTurnFromFEN(fen: string) {
        return fen.split(/\s+/)[1] as Turn;
      }

      function setTurn(_move: PgnMove, _currentTurn: Turn) {
        function switchTurn(currentTurn: Turn) {
          return currentTurn === "w" ? "b" : "w";
        }
        _move.turn = _currentTurn;
        if (_move.variations) {
          _move.variations.forEach(function (variation) {
            let varTurn = _currentTurn;
            variation.forEach((varMove) => (varTurn = setTurn(varMove, varTurn)));
          });
        }
        return switchTurn(_currentTurn);
      }

      const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      let fen = _options.fen || (_game.tags && _game.tags["FEN"]) || START;
      let currentTurn = getTurnFromFEN(fen);
      _game.moves.forEach((move) => (currentTurn = setTurn(move, currentTurn)));
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
export function parseGames(input: string, options: PgnOptions = { startRule: "games" }): ParseTree[] {
  function handleGamesAnomaly(parseTree: ParseTree[]): ParseTree[] {
    if (!Array.isArray(parseTree)) return [];
    if (parseTree.length === 0) return parseTree;
    let last: ParseTree = parseTree.pop() as ParseTree;
    if (last.tags !== undefined || last.moves.length > 0) {
      parseTree.push(last);
    }
    return parseTree;
  }

  function postParseGames(parseTrees: ParseTree[], input: string, options: PgnOptions = { startRule: "games" }) {
    return handleGamesAnomaly(parseTrees);
  }

  try {
    const gamesOptions = Object.assign({ startRule: "games" }, options);
    let result = (<ParseTree[]>PegParser.parse(input, gamesOptions)) as ParseTree[];
    if (!result) {
      return [];
    }
    postParseGames(result, input, gamesOptions);
    result.forEach((pt) => {
      postParseGame(pt, input, gamesOptions);
    });
    return result;
  } catch (error) {
    // error will be enhanced, so throw the returning error object
    throw parseError(input, options, error);
  }
}

// export { SyntaxError };
