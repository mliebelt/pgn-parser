import { ParseTree, ParseTreeOrArray, PgnOptions } from "./types";
/**
 * General parse function, that accepts all `startRule`s. Calls then the more specific ones, so that the
 * postParse processing can now rely on the same structure all the time.
 */
export declare function parse(input: string, options: PgnOptions): ParseTreeOrArray;
export declare function parseGame(input: string, options?: PgnOptions): ParseTree;
export declare function parseGames(input: any, options?: PgnOptions): ParseTree[];
//# sourceMappingURL=pgn-parser.d.ts.map