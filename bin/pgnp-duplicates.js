#! /usr/bin/env node
// Provides a script to search for duplicates in given PGN files.

// Here is what should be done over time (see the ticket https://github.com/mliebelt/pgn-parser/issues/79 for details):
//  1. Add a new option to the command line interface to specify the PGN files to search for duplicates, so build
//     a stub that shows that arguments are working.
//  2. Implement the rough algorithm, happy path, no error handling.
//  3. Implement error handling.

const fs = require("fs");
const path = require("path");
const { parse } = require("..");

const STDIN_FILE_NO = 0;

const usage = () => `\
Parse PGN files to JSON.

USAGE:
  pgn-parser [options] [--] [FILE]...

OPTIONS:
  -h, --help       Show help

ARGS:
  <FILE>...     PGN file(s) to parse as JSON. Use '-' for stdin.
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
