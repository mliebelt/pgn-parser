#! /usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { parse } = require("..");

const STDIN_FILE_NO = 0;

const usage = () => `\
Parse PGN files to JSON.

USAGE:
  pgn-to-json [options] [FILE]...

OPTIONS:
  -h, --help       Show help
  -p, --pretty     Output formatted json

ARGS:
  <FILE>...     PGN file(s) to parse as JSON. Use '-' for stdin.
                If no FILE is provided it reads from stdin`;

const processArguments = (process) => {
  const args = process.argv.slice(2);
  const files = [];
  const options = {};

  for (const arg of args) {
    if (arg.startsWith('-')) {
      switch (arg) {
        case '-h':
        case '--help':
          options.help = true;
          break;

        case '-p':
        case '--pretty':
          options.pretty = true;
          break;

        case '-':
          files.push(0);
          break;

        default:
          throw Error(`Unknown option ${arg}`);
      }
    } else {
      files.push(arg)
    }
  }

  if (files.length === 0) {
    files.push(0);
  }

  return { files, options }
};

const filesToJson = (files) => {
  const games = [];

  for (const file of files) {
    const fileContent = fs
      .readFileSync(file === 0 ? file : path.resolve(file))
      .toString()
      .trim();

    if (fileContent) {
      const gamesOnFile = parse(fileContent, { startRule: "games" });

      games.push(...gamesOnFile);
    }
  }

  return games;
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

  const { files, options } = arguments

  if (options.help) {
    console.log(usage())
    process.exit(0)
    return
  }

  const gamesParsed = filesToJson(files);

  const gamesJson = (
    options.pretty
      ? JSON.stringify(gamesParsed, null, 2)
      : JSON.stringify(gamesParsed)
  )

  console.log(gamesJson)
};

main(process);
