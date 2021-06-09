const path = require('path')
const shell = require('shelljs')

const peggyPath = path.resolve('./node_modules/peggy/bin/peggy')
// node_modules/peggy/bin/peggy --allowed-start-rules pgn,tags,game,games -o _pgn-parser.js src/pgn-rules.pegjs
shell.exec(`node ${peggyPath} --allowed-start-rules pgn,tags,game,games -o _pgn-parser.js src/pgn-rules.pegjs`)