import { ParseTree, ParseTreeOrArray, PgnOptions } from "./types";
/**
 * General parse function, that accepts all `startRule`s. Calls then the more specific ones, so that the
 * postParse processing can now rely on the same structure all the time.
 * @param input - the PGN string that will be parsed according to the `startRule` given
 * @param options - the parameters that have to include the `startRule`
 */
export declare function parse(input: string, options: PgnOptions): ParseTreeOrArray;
/**
 * Special parse function to parse one game only, options may be omitted.
 * @param input - the PGN string that will be parsed
 * @param options - object with additional parameters (not used at the moment)
 * @returns a ParseTree with the defined structure
 */
export declare function parseGame(input: string, options?: PgnOptions): ParseTree;
/**
 * Parses possibly more than one game, therefore returns an array of ParseTree.
 * @param input the PGN string to parse
 * @param options the optional parameters (not used at the moment)
 * @returns an array of ParseTrees, one for each game included
 */
export declare function parseGames(input: any, options?: PgnOptions): ParseTree[];
//# sourceMappingURL=pgn-parser.d.ts.map