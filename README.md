# pgn-parser

![Node.js CI](https://github.com/mliebelt/pgn-parser/workflows/Node.js%20CI/badge.svg)

Javascript library to allow reading of a PGN (Portable Game Notation) chess game notation, and providing the result as JSON.

## What is it?

[PGN](http://www.saremba.de/chessgml/standards/pgn/pgn-complete.htm) is a shortcut for [portable game notation](https://en.wikipedia.org/wiki/Portable_Game_Notation). It was developed in 1993. It should help standardize how chess games where notated, so that computer programs like the [PgnViewerJS](https://github.com/mliebelt/PgnViewerJS)  could be developed then. PGN is the standard to keep chess games forever. There are huge databases available like those from lichess.org.

## Who needs it?

Everyone that wants to implement chess software and has to read PGN notation. The library is a runtime component to be included in the usual way.

    import parser from '@mliebelt/pgn-parser'

## How to install it?

    npm i @mliebelt/pgn-parser --save

## How to use it?

Look at the many test cases that show how to use it. Here is an example:

    import parser from '@mliebelt/pgn-parser'
    let moves = parser.parse("1. {first move} e4! {my favorite} e5 (1... c5!?)")
    moves[0].moveNumber
    
It does not have an API, just a JSON structure that has to be read then.

![Example JON for above PGN](doc/pgn-json.png)
