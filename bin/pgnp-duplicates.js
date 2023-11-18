#! /usr/bin/env node
// Provides a script to search for duplicates in given PGN files.

// Here is what should be done over time (see the ticket https://github.com/mliebelt/pgn-parser/issues/79 for details):
//  1. Add a new option to the command line interface to specify the PGN files to search for duplicates, so build
//     a stub that shows that arguments are working.
//  2. Implement the rough algorithm, happy path, no error handling.
//  3. Implement error handling.

const fs = require("fs");
const path = require("path");
const { filesToJson } = require("..");

const STDIN_FILE_NO = 0;

const usage = () => `\
Checks given files for duplicates.

USAGE:
  npm run pgnp-duplicates [--] [FILES]...

OPTIONS:
  -h, --help       Show help

ARGS:
  <FILES>...     PGN file(s) to search duplicates in. Use '-' for stdin.
                If no FILE is provided it reads from stdin`

const processArguments = (process) => {
    const args = process.argv.slice(2);
    const files = [];
    const options = { help: false, pretty: false };
    let onlyFiles = false

    for (const arg of args) {
        if (arg.startsWith('-') && !onlyFiles) {
            switch (arg) {
                case '-h':
                case '--help':
                    options.help = true;
                    break;

                case '-':
                    files.push(STDIN_FILE_NO);
                    break;

                case '--':
                    onlyFiles = true
                    break

                default:
                    throw Error(`Unknown option ${arg}`);
            }
        } else {
            files.push(arg)
            onlyFiles = true
        }
    }

    if (files.length === 0) {
        files.push(STDIN_FILE_NO);
    }

    return { files, options }
};

const duplicates = (files) => {
    console.log('Call received with', files)
    // TODO: Implement the algorithm.
    // 1. Read all files as JSON
    let games = filesToJson(files)
    console.log('Read num arrays == files:', games.length)
    console.log('Read num games in last file: ', games[games.length - 1].length)
    // 2. Strip all read games to their mainline
    // 3. Compute hash for all mainlines and hold them appropriately
    // 4. For each mainline, check if there is another mainline with the same hash
};

const main = (process) => {
    let arguments

    try {
        arguments = processArguments(process);
    } catch(e) {
        console.error(e.message)
        console.log(usage())
        process.exit(1)
        return
    }

    const { files, options: { help } } = arguments

    if (help) {
        console.log(usage())
        process.exit(0)
        return
    }

    duplicates(files)
};

main(process);
