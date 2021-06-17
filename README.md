# pgn-parser

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/mliebelt/pgn-parser/Node.js%20CI?logo=github&label=Build%26Test)
![GitHub package.json version](https://img.shields.io/github/package-json/v/mliebelt/pgn-parser?color=33aa33&label=Version&logo=npm)
![npm](https://img.shields.io/npm/dm/@mliebelt/pgn-parser?label=Downloads&logo=npm)
![GitHub](https://img.shields.io/github/license/mliebelt/pgn-parser?label=License)
<!--- ![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/:mliebelt/:pgn-parser)
is currently not working, so it is skipped. Check that later again. --->

Javascript library to allow reading of a PGN (Portable Game Notation) chess game notation, and providing the result as JSON.

## What is it?

[PGN](http://www.saremba.de/chessgml/standards/pgn/pgn-complete.htm) is a shortcut for [portable game notation](https://en.wikipedia.org/wiki/Portable_Game_Notation). It was developed in 1993. It helps standardize how chess games were
notated, so that computer programs like the [PgnViewerJS](https://github.com/mliebelt/PgnViewerJS)  could be developed. PGN is the standard to keep chess games forever. There are huge databases available like those from https://lichess.org.

## Who needs it?

Everyone that wants to implement chess software and has to read PGN notation. The library is a runtime component to be included in the usual way.

    import parser from '@mliebelt/pgn-parser'

## How to install it?

    npm i @mliebelt/pgn-parser --save

## How to use it?

Look at the many test cases that show how to use it. Here is an example:

```javascript
const fs = require('fs/promises')
const path = require('path')
const {splitter, parser} = require('@mliebelt/pgn-parser')
// helpers
const parseGames = (string) => parser.parse(string, {startRule: 'games'})
const splitGames = (string) => splitter.split(string, {startRule: "games"})

const moves = parseGames("1. {first move} e4! {my favorite} e5 (1... c5!?)")
console.log('moves[0] = ', moves[0].moveNumber)

const gameFilePath = path.resolve(__filename, 'node_modules/@mliebelt/pgn-parser/sample.pgn')
fs.readFile(gameFilePath, 'utf-8')
        .then(pgnFile=> {
           const games = splitGames(pgnFile)
           const players = []
           games.forEach((game) => {
              const tags = parser.parse(game.tags, {startRule: 'tags'})
              players.push(tags.White)
              players.push(tags.Black)
           })
           console.log('Games: ', JSON.stringify(games, null, 2))
        })
        .catch(console.error)
```

It does not have an API, just a JSON structure that has to be read then. You have 4 top level rules to use the parser:

* `games`: Reads many games from the string given, returns an array of games (object with keys `tags` and `moves`).
* `game`: Reads a complete game, and returns an object with keys `tags` and `moves`.
* `tags`: Reads only the tags from the given input. The input must not contain any moves.
* `pgn`: Reads only the moves of the game (as array).

A code example to read a complete game then looks like:

    import parser from '@mliebelt/pgn-parser'
    let game = parser.parse('[White "Me"] [Black "Magnus"] 1. f4 e5 2. g4 Qh4#', {startRule: "game"})
    console.log(JSON.stringify(res, null, 2))
    ==>
    JSON.stringify(res, null, 2)
    {
      "tags": {
        "White": "Me",
        "Black": "Magnus"
      },
      "moves": [
        {
          "turn": "w",
          "moveNumber": 1,
        ...
        },
        {...},
        ...
      ]
    }

## How to use it in the browser?

If you want to use the library in the browser, the above method will not work. In the [ticket 22](https://github.com/mliebelt/pgn-parser/issues/22), Bebul explained how to do it. Here is the complete recipe:

1. Install [Browserify](http://browserify.org/).
1. Store the parse function as window property

        File: parsePgn.js
        ----
        const parser =  require('./pgn-parser.js')
        window.parsePgn = parser.parse

1. Process newly created parsePgn.js through Browserify.

       browserify parsePgn.js -o pgn-bundle.js

1. In the `index.html` then use:

        <script type="text/javascript" src="pgn/pgn-bundle.js"></script>

1. And the parsePgn is now available:

         let gameList = parsePgn('[White "Me"] [Black "Magnus"] 1. f4 e5 2. g4 Qh4#', {startRule: "game"});        

## References

* [peggy](https://github.com/peggyjs/peggy) Parser Generator implemented in Javascript. Used for regenerating the javascript library completely by an automatic build.
* [PGN Specification](https://github.com/mliebelt/pgn-spec-commented/blob/main/pgn-specification.md): PGN (Portable Game Notation) specification, there the section 8.2. Most other parts of the spec are implemented as well.
* [PGN Supplement](https://github.com/mliebelt/pgn-spec-commented/blob/main/pgn-spec-supplement.md) Additional specification for adding structured comments, like circles, arrows and clock annotations.
* [NAG Specification](http://en.wikipedia.org/wiki/Numeric_Annotation_Glyphs) Definition of the NAGs (Numeric Annotation Glyphs)
