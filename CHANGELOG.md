# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

### Changed
### Fixed

## [1.1.0]() 20-06-17

### Changed

* Updated `CHANGELOG.md` to include the latest changes.
* Updated `README.md` to explain how to use different start rules.
* Allowed additional start rule `games` to read many games in one run. Incredible speed (>9.000 games in 2.5s).

### Fixed

* [#13](https://github.com/mliebelt/pgn-parser/issues/13) Not necessary, closed therefore.
* [#12](https://github.com/mliebelt/pgn-parser/issues/12) Read many complete games.

## [1.0.1]() 20-05-29

### Changed

* Removed doublequotes from the tags, because they are not included in the original spec.

### Fixed

## [1.0.0]() 20-05-27

### Changed

* Migrated from expect to should.
* Top level rules are now game, pgn, tags.

### Fixed

* [#11](https://github.com/mliebelt/pgn-parser/issues/11) Read a complete game at once (tags and pgn).

## [0.10.0]() 20-05-17

### Changed

* Added grammar for tags.
* Kept as default rule `pgn` to be backward compatible.
* Added Github workflow to check at each commit build and tests.
* Migrated to Mocha and Expect.

### Fixed

* [#1](https://github.com/mliebelt/pgn-parser/issues/1) Migrated all test cases to Mocha, developed mostly new ones.
* [#3](https://github.com/mliebelt/pgn-parser/issues/3) Provide a useful README to explain installation, usage, ...
* [#6](https://github.com/mliebelt/pgn-parser/issues/6) Integrates tags into the grammar.

## [0.9.9]() 20-05-11

### Changed

### Fixed

* [#3](https://github.com/mliebelt/pgn-parser/issues/3) Provides a speaking nice `README.md` with sufficient information.
* [#1](https://github.com/mliebelt/pgn-parser/issues/1) Defined a lot of test cases to have the complete scope of the grammar.
* [#2](https://github.com/mliebelt/pgn-parser/issues/2) Automate the build of the generation of the parser.

## [0.9.8]() 2019-05-10

Inital version, functional identical to file `PgnViewerJS/src/pgn-parser.js` (now deleted).

### Changed

* Made it buildable by NPM.
* Deployed that version as fully functional package that can be used by `npm i mliebelt@pgn-parser`.

### Fixed

Nothing