export declare type StartRule = 'pgn' | 'game' | 'tags' | 'games';
export declare type PgnOptions = {
    startRule: StartRule;
    fen?: string;
};
export declare type ParseTree = {
    tags?: Tags;
    gameComment?: GameComment;
    moves: PgnMove[];
} & MessagesObject;
declare type SevenRoosterTagKeys = 'Event' | 'Site' | 'Round' | 'White' | 'Black' | 'Result';
export declare type SevenRoosterTags = {
    [key in SevenRoosterTagKeys]: string;
} & {
    Date?: PgnDate;
};
export declare type PlayerTagKeys = 'WhiteTitle' | 'BlackTitle' | 'WhiteElo' | 'BlackElo' | 'WhiteUSCF' | 'BlackUSCF' | 'WhiteNA' | 'BlackNA' | 'WhiteType' | 'BlackType';
export declare type EventTagKeys = 'EventSponsor' | 'Section' | 'Stage' | 'Board';
export declare type OpeningTagKeys = 'Opening' | 'Variation' | 'SubVariation' | 'ECO' | 'NIC';
export declare type AlternativeStartingKeys = 'SetUp' | 'FEN';
export declare type GameConclusionTagKeys = 'Termination';
export declare type MiscTagKeys = 'Annotator' | 'Mode' | 'PlyCount';
export declare type LichessTagKeys = 'PuzzleEngine' | 'PuzzleMakerVersion' | 'PuzzleCategory' | 'PuzzleWinner' | 'Variant' | 'WhiteRatingDiff' | 'BlackRatingDiff' | 'WhiteFideId' | 'BlackFideId' | 'WhiteTeam' | 'BlackTeam';
export declare type ClockTagKeys = 'Clock' | 'WhiteClock' | 'BlackClock';
export declare type TagKeys = SevenRoosterTagKeys | PlayerTagKeys | EventTagKeys | OpeningTagKeys | AlternativeStartingKeys | GameConclusionTagKeys | MiscTagKeys | LichessTagKeys | ClockTagKeys;
export declare type TimeControlKeys = 'TimeControl';
export declare type TimeControl = {
    kind?: string;
    value?: string;
    moves?: number;
    seconds?: number;
    increment?: number;
};
export declare type DateTagKeys = 'Date' | 'EventDate' | 'UTCDate';
export declare type PgnDate = {
    value?: string;
    year?: number;
    month?: number;
    day?: number;
};
export declare type DateTags = {
    [key in DateTagKeys]: PgnDate;
};
export declare type TimeTagKeys = 'Time' | 'UTCTime';
export declare type PgnTime = {
    value?: string;
    hour?: number;
    minute?: number;
    second?: number;
};
export declare type TimeTags = {
    [key in TimeTagKeys]: PgnTime;
};
export declare type Tags = {
    [key in TagKeys]: string;
} & DateTags & TimeTags & MessagesObject & {
    [key in TimeControlKeys]: TimeControl;
};
declare type Message = {
    key: string;
    value: string;
    message: string;
};
declare type MessagesObject = {
    messages: Message[];
};
declare type GameComment = {
    comment?: string;
    colorArrows?: string[];
    colorFields?: string[];
    clk?: string;
    eval?: string;
};
export declare type ParseTreeOrArray = ParseTree | ParseTree[];
export declare type PgnMove = {
    moveNumber: number;
    notation: {
        fig?: string | null;
        strike: 'x' | null;
        col: string;
        row: string;
        check: boolean;
        promotion: string | null;
        notation: string;
        disc?: string;
        drop?: boolean;
    };
    variations: PgnMove[][];
    nag: string | null;
    commentDiag: GameComment;
    commentMove?: string;
    commentAfter?: string;
    turn: 'w' | 'b';
};
export {};
//# sourceMappingURL=types.d.ts.map