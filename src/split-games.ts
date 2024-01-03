export const normalizeLineEndings = (str: string, normalized = '\n'): string =>
    str.replace(/\r?\n/g, normalized);

type TagString = string
type PgnString = string
export type SplitGame = { tags: TagString, pgn: PgnString, all: string }
import {PgnOptions} from "./types";

/**
 * Returns an array of SplitGames, which are objects that may contain tags and / or pgn strings.
 * The split function expects well formed export format strings (see [8.1 Tag pair section](https://github.com/mliebelt/pgn-spec-commented/blob/main/pgn-specification.md#81-tag-pair-section), statement "a single empty line follows the last tag pair"). So the split function only works when tags are separated from pgn string by an empty line, and the next game is separated by at least one empty line as well.
 * @param input - the PGN string that may contain multiple games
 * @param options - not used at the moment
 * @returns an array of SplitGame to be parsed later
 */
export function split(input:string, options:PgnOptions = {startRule: "games"}):SplitGame[] {
    // let result = parser.parse(input, options)
    let result = normalizeLineEndings(input).split(/\n\n+/)
    let res: SplitGame[] = []
    let g: SplitGame = { tags: '', pgn: '', all: ''}
    result.forEach(function (part) {
        if (part.startsWith('[')) {
            g.tags = part
        } else if (part) {
            g.pgn = part
            let game = g.tags ? g.tags + "\n\n" + g.pgn : g.pgn
            g.all = game
            res.push(g)
            g = { tags: '', pgn: '', all: '' }
        }
    })
    return res
}
