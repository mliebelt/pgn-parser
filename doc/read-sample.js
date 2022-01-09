const fs = require('fs/promises')
const path = require('path')
const parse = require('..').parse
const split = require('..').split
// helpers
const parseGames = (string) => parse(string, {startRule: 'games'})
const splitGames = (string) => split(string, {startRule: "games"})

// assuming source directory is sibling of node_modules
const gameFilePath = path.resolve(__dirname, './sampleGame.pgn')
fs.readFile(gameFilePath, 'utf-8')
    .then(pgnFile=> {
        const game = parseGames(pgnFile).pop()
        console.log('game.moves[0] = ', game.moves[0])
    })
    .catch(console.error)