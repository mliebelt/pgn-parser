import {ParseTree} from "./types";
import { parse} from "./pgn-parser";

const fs = require("fs");
const path = require("path");

export function filesToJson(files: string[])  {
    const games: ParseTree[][] = [];

    for (const file of files) {
        const fileContent = fs
            .readFileSync(path.resolve(file))
            .toString()
            .trim();

        if (fileContent) {
            const gamesOnFile = parse(fileContent, { startRule: "games" }) as ParseTree[];
            // @ts-ignore
            games.push(gamesOnFile);
        }
    }

    return games;
};

