(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    (function (factory) {
        if (typeof module === "object" && typeof module.exports === "object") {
            var v = factory(require, exports);
            if (v !== undefined) module.exports = v;
        }
        else if (typeof define === "function" && define.amd) {
            define(["require", "exports", "./split-games", "./pgn-parser"], factory);
        }
    })(function (require, exports) {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.parse = exports.split = void 0;
        var split_games_1 = require("./split-games");
        Object.defineProperty(exports, "split", { enumerable: true, get: function () { return split_games_1.split; } });
        var pgn_parser_1 = require("./pgn-parser");
        Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return pgn_parser_1.parse; } });
    });

}));
