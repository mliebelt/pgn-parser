declare type TagString = string;
declare type PgnString = string;
export declare type SplitGame = {
    tags: TagString;
    pgn: PgnString;
    all: string;
};
import { PgnOptions } from "./types";
export declare function split(input: string, options: PgnOptions): SplitGame[];
export {};
//# sourceMappingURL=split-games.d.ts.map