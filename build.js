const peg = require('peggy')
const fs = require('fs/promises')

// node_modules/peggy/bin/peggy --allowed-start-rules pgn,tags,game,games -o _pgn-parser.js src/pgn-rules.pegjs
const main = async () => {
    const options = {allowedStartRules: ['pgn', 'tags', 'game', 'games'], output: 'source', format: 'umd'}
    const pgnParser = peg.generate(await fs.readFile('./src/pgn-rules.pegjs', 'utf-8'), options)
    await fs.writeFile('_pgn-parser.js', pgnParser)
}
main().catch(console.error)