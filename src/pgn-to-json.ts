import {ParseTree} from "./types"
import { parseGames} from "./pgn-parser"

const fs = require("fs")
const path = require("path")

export function parseFiles(files: string[])  {
    const games: ParseTree[][] = []

    for (const file of files) {
        const fileContent = fs
            .readFileSync(path.resolve(file))
            .toString()
            .trim()

        if (fileContent) {
            const gamesOnFile = parseGames(fileContent) as ParseTree[]
            games.push(gamesOnFile)
        }
    }

    return games
}

