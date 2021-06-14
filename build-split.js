const peg = require('peggy')
const fs = require('fs')

// node_modules/peggy/bin/peggy -o _pgn-split.js src/split-rules.pegjs
const main = async () => {
    const options = {output: 'source', format: 'umd'}
    const pgnParser = peg.generate(await fs.readFileSync('./src/split-rules.pegjs', 'utf-8'), options)
    await fs.writeFileSync('_split-parser.js', pgnParser)
}
main().catch(console.error)