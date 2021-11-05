declare type StartRule = 'pgn' | 'game' | 'tags' | 'games';
declare type PgnOptions = {
    startRule: StartRule;
};
/**
 * Patches the original function, to avoid empty games. May include additional functionality
 * for understanding parse errors later.
 */
export declare function parse(input: string, options: PgnOptions): any;
export {};
//# sourceMappingURL=pgn-parser.d.ts.map