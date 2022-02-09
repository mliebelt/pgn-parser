import { ParseTree} from "./types"

export type SyntaxError = {expected: string, found: string, location: number }
export function parse(input: string, options: object): ParseTree