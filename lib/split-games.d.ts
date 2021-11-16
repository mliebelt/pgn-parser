declare type TagString = string;
declare type PgnString = string;
export declare type SplitGame = {
    tags: TagString;
    pgn: PgnString;
    all: string;
};
import { PgnOptions } from "./types";
/**
 * Returns an array of SplitGames, which are objects that may contain tags and / or pgn strings.
 * @param input - the PGN string that may contain multiple games
 * @param options - not used at the moment
 * @returns an array of SplitGame to be parsed later
 */
export declare function split(input: string, options?: PgnOptions): SplitGame[];
export {};
//# sourceMappingURL=split-games.d.ts.map