(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.split = void 0;
    const normalizeLineEndings = (str, normalized = '\n') => str.replace(/\r?\n/g, normalized);
    /**
     * Returns an array of SplitGames, which are objects that may contain tags and / or pgn strings.
     * @param input - the PGN string that may contain multiple games
     * @param options - not used at the moment
     * @returns an array of SplitGame to be parsed later
     */
    function split(input, options = { startRule: "games" }) {
        // let result = parser.parse(input, options)
        let result = normalizeLineEndings(input).split("\n\n");
        let res = [];
        let g = { tags: '', pgn: '', all: '' };
        result.forEach(function (part) {
            if (part.startsWith('[')) {
                g.tags = part;
            }
            else if (part) {
                g.pgn = part;
                let game = g.tags ? g.tags + "\n\n" + g.pgn : g.pgn;
                g.all = game;
                res.push(g);
                g = { tags: '', pgn: '', all: '' };
            }
        });
        return res;
    }
    exports.split = split;
});
