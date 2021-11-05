const normalizeLineEndings = (str, normalized = '\n') => str.replace(/\r?\n/g, normalized);
export const split = function (input, options) {
    // let result = parser.parse(input, options)
    let result = normalizeLineEndings(input).split("\n\n");
    let res = [];
    let g = { tags: '', pgn: '', all: '' };
    result.forEach(function (part) {
        if (part.startsWith('[')) {
            g.tags = part;
        }
        else if (part) {
            g.pgn = part;
            let game = g.tags ? g.tags + "\n\n" + g.pgn : g.pgn;
            g.all = game;
            res.push(g);
            g = { tags: '', pgn: '', all: '' };
        }
    });
    return res;
};
