declare type StartRule = 'pgn' | 'game' | 'tags' | 'games';
declare type PgnOptions = {
    startRule: StartRule;
    fen?: string;
};
declare type ParseTree = {
    tags?: Tags;
    gameComment?: GameComment;
    moves: PgnMove[];
} & MessagesObject;
declare type SevenRoosterTagKeys = 'Event' | 'Site' | 'Round' | 'White' | 'Black' | 'Result';
declare type SevenRoosterTags = {
    [key in SevenRoosterTagKeys]: string;
} & {
    Date?: PgnDate;
};
declare type PlayerTagKeys = 'WhiteTitle' | 'BlackTitle' | 'WhiteElo' | 'BlackElo' | 'WhiteUSCF' | 'BlackUSCF' | 'WhiteNA' | 'BlackNA' | 'WhiteType' | 'BlackType';
declare type EventTagKeys = 'EventSponsor' | 'Section' | 'Stage' | 'Board';
declare type OpeningTagKeys = 'Opening' | 'Variation' | 'SubVariation' | 'ECO' | 'NIC';
declare type AlternativeStartingKeys = 'SetUp' | 'FEN';
declare type GameConclusionTagKeys = 'Termination';
declare type MiscTagKeys = 'Annotator' | 'Mode' | 'PlyCount';
declare type LichessTagKeys = 'PuzzleEngine' | 'PuzzleMakerVersion' | 'PuzzleCategory' | 'PuzzleWinner' | 'Variant' | 'WhiteRatingDiff' | 'BlackRatingDiff' | 'WhiteFideId' | 'BlackFideId' | 'WhiteTeam' | 'BlackTeam';
declare type ClockTagKeys = 'Clock' | 'WhiteClock' | 'BlackClock';
declare type TagKeys = SevenRoosterTagKeys | PlayerTagKeys | EventTagKeys | OpeningTagKeys | AlternativeStartingKeys | GameConclusionTagKeys | MiscTagKeys | LichessTagKeys | ClockTagKeys;
declare type TimeControlKeys = 'TimeControl';
declare type TimeControl = {
    kind?: string;
    value?: string;
    moves?: number;
    seconds?: number;
    increment?: number;
};
declare type DateTagKeys = 'Date' | 'EventDate' | 'UTCDate';
declare type PgnDate = {
    value?: string;
    year?: number;
    month?: number;
    day?: number;
};
declare type DateTags = {
    [key in DateTagKeys]: PgnDate;
};
declare type TimeTagKeys = 'Time' | 'UTCTime';
declare type PgnTime = {
    value?: string;
    hour?: number;
    minute?: number;
    second?: number;
};
declare type TimeTags = {
    [key in TimeTagKeys]: PgnTime;
};
declare type Tags = {
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
    egt?: string;
    emt?: string;
    mct?: string;
    eval?: string;
};
declare type ParseTreeOrArray = ParseTree | ParseTree[];
declare type PgnMove = {
    drawOffer: boolean;
    moveNumber: number;
    notation: {
        fig?: string | null;
        strike?: 'x' | null;
        col: string;
        row: string;
        check?: string;
        promotion: string | null;
        notation: string;
        disc?: string;
        drop?: boolean;
    };
    variations: PgnMove[][];
    nag: string[];
    commentDiag: GameComment;
    commentMove?: string;
    commentAfter?: string;
    turn: 'w' | 'b';
};

/**
 * General parse function, that accepts all `startRule`s. Calls then the more specific ones, so that the
 * postParse processing can now rely on the same structure all the time.
 * @param input - the PGN string that will be parsed according to the `startRule` given
 * @param options - the parameters that have to include the `startRule`
 * @returns a ParseTree or an array of ParseTrees, depending on the startRule
 */
declare function parse(input: string, options: PgnOptions): ParseTreeOrArray;
/**
 * Special parse function to parse one game only, options may be omitted.
 * @param input - the PGN string that will be parsed
 * @param options - object with additional parameters (not used at the moment)
 * @returns a ParseTree with the defined structure
 */
declare function parseGame(input: string, options?: PgnOptions): ParseTree;
/**
 * Parses possibly more than one game, therefore returns an array of ParseTree.
 * @param input the PGN string to parse
 * @param options the optional parameters (not used at the moment)
 * @returns an array of ParseTrees, one for each game included
 */
declare function parseGames(input: any, options?: PgnOptions): ParseTree[];

declare type TagString = string;
declare type PgnString = string;
declare type SplitGame = {
    tags: TagString;
    pgn: PgnString;
    all: string;
};

/**
 * Returns an array of SplitGames, which are objects that may contain tags and / or pgn strings.
 * @param input - the PGN string that may contain multiple games
 * @param options - not used at the moment
 * @returns an array of SplitGame to be parsed later
 */
declare function split(input: string, options?: PgnOptions): SplitGame[];

export { AlternativeStartingKeys, ClockTagKeys, DateTagKeys, DateTags, EventTagKeys, GameComment, GameConclusionTagKeys, LichessTagKeys, Message, MiscTagKeys, OpeningTagKeys, ParseTree, ParseTreeOrArray, PgnDate, PgnMove, PgnOptions, PgnTime, PlayerTagKeys, SevenRoosterTags, SplitGame, StartRule, TagKeys, Tags, TimeControl, TimeControlKeys, TimeTagKeys, TimeTags, parse, parseGame, parseGames, split };
