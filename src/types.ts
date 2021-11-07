export type StartRule = 'pgn' | 'game' | 'tags' | 'games'
export type PgnOptions = { startRule: StartRule, fen?: string }
export type ParseTree = { tags?: Tags, gameComment?: GameComment, moves: PgnMove[] } & MessagesObject

type SevenRoosterTagKeys = 'Event'|'Site'|'Round'|'White'|'Black'|'Result'
export type SevenRoosterTags = { [key in SevenRoosterTagKeys]: string } & { Date?: PgnDate }
export type PlayerTagKeys = 'WhiteTitle'|'BlackTitle'|'WhiteElo'|'BlackElo'|'WhiteUSCF'|'BlackUSCF'|'WhiteNA'|
    'BlackNA'|'WhiteType'|'BlackType'
export type EventTagKeys = 'EventSponsor'|'Section'|'Stage'|'Board'
export type OpeningTagKeys = 'Opening'|'Variation'|'SubVariation'|'ECO'|'NIC'
export type AlternativeStartingKeys = 'SetUp'|'FEN'
export type GameConclusionTagKeys = 'Termination'
export type MiscTagKeys = 'Annotator'|'Mode'|'PlyCount'
export type LichessTagKeys = 'PuzzleEngine'|'PuzzleMakerVersion'|'PuzzleCategory'|'PuzzleWinner'|'Variant'|'WhiteRatingDiff'|
    'BlackRatingDiff'|'WhiteFideId'|'BlackFideId'|'WhiteTeam'|'BlackTeam'
export type ClockTagKeys = 'Clock'|'WhiteClock'|'BlackClock'
export type TagKeys = SevenRoosterTagKeys | PlayerTagKeys | EventTagKeys | OpeningTagKeys |
    AlternativeStartingKeys | GameConclusionTagKeys | MiscTagKeys | LichessTagKeys | ClockTagKeys
export type TimeControlKeys = 'TimeControl'
export type TimeControl = { kind?: string, value?: string, moves?: number, seconds?: number, increment?: number }
export type DateTagKeys = 'Date'|'EventDate'|'UTCDate'
export type PgnDate = { value?: string, year?: number, month?: number, day?: number }
export type DateTags = { [key in DateTagKeys]: PgnDate }
export type TimeTagKeys = 'Time'|'UTCTime'
export type PgnTime = { value?: string, hour?: number, minute?: number, second?: number }
export type TimeTags = { [key in TimeTagKeys]: PgnTime }
export type Tags = { [key in TagKeys]: string } & DateTags & TimeTags & MessagesObject & { [key in TimeControlKeys]: TimeControl }

type Message = { key: string, value: string, message: string }
type MessagesObject = { messages: Message[] }

type GameComment = { comment?: string, colorArrows?: string[], colorFields?: string[], clk?: string, eval?: string }
export type ParseTreeOrArray = ParseTree | ParseTree[]
export type PgnMove = {
    moveNumber: number,
    notation: { fig?: string | null, strike: 'x' | null, col: string, row: string, check: boolean,
        promotion: string | null, notation: string, disc?: string, drop?: boolean },
    variations: PgnMove[][],
    nag: string | null,
    commentDiag: GameComment,
    commentMove?: string,
    commentAfter?: string,
    turn: 'w' | 'b'
}