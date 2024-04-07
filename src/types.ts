import {GameComment, PgnMove, Tags, MessagesObject} from '@mliebelt/pgn-types'
export type StartRule = 'pgn' | 'game' | 'tags' | 'games'
export type PgnOptions = { startRule: StartRule, fen?: string }
export type ParseTree = { tags?: Tags, gameComment?: GameComment, moves: PgnMove[] } & MessagesObject
export type Turn = "w"|"b"