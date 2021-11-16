"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.split = void 0;
var split_games_1 = require("./split-games");
Object.defineProperty(exports, "split", { enumerable: true, get: function () { return split_games_1.split; } });
var pgn_parser_1 = require("./pgn-parser");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return pgn_parser_1.parse; } });
