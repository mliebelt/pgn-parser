# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Not released

### Changed

### Fixed

## [1.2.1](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.2.1) 21-03-26

### Changed

### Fixed

* [#40](https://github.com/mliebelt/pgn-parser/issues/40) Ignore unknown actions in comments like `1. e4 {[%foo 1.01]}`.
* [#41](https://github.com/mliebelt/pgn-parser/issues/41) Read eval comments and store in `commentDiags`.

## [1.2.0](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.2.0) 21-03-14

### Changed

* Cleaned up grammar about comments, with a breaking change (removing `commentBefore`).

### Fixed

* [#25](https://github.com/mliebelt/pgn-parser/issues/25) Was fixed some time before, added a test case.
* [#34](https://github.com/mliebelt/pgn-parser/issues/34) Add game comment at the beginning, could be used for graphical annotations of the start position as well. PGN works with Chesstempo, Lichess, Scid. 
* [#35](https://github.com/mliebelt/pgn-parser/issues/35) Cleaned up grammar, remove `commentBefore`.
* [#36](https://github.com/mliebelt/pgn-parser/issues/36) Restricted move numbers to the valid format from spec.


## [1.1.6](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.1.6) 21-03-10

### Changed

* Restructured grammar, especially the part about comments.
* Reformatted test cases to avoid `var`.

### Fixed

* [#8](https://github.com/mliebelt/pgn-parser/issues/8) Changed format `{ clock: { key: "clk", value: "01:01:01" } }` to `{ clk: "01:01:01" }`.
* [#31](https://github.com/mliebelt/pgn-parser/issues/31) Reworked grammar according to the spec and supplement.
* [#32](https://github.com/mliebelt/pgn-parser/issues/32) All mix of comments now possible.

## [1.1.5](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.1.5) 21-02-28

### Changed

* [#33](https://github.com/mliebelt/pgn-parser/issues/33) Allow end-of-line comments triggered by `;`.
* [#29](https://github.com/mliebelt/pgn-parser/pull/29) Integrate Chessbase style of arrows mixing comments in.

### Fixed

* [#28](https://github.com/mliebelt/pgn-parser/pull/28) Fixes typo in README.
* [#27](https://github.com/mliebelt/pgn-parser/pull/27) Update Mocha (dependabot).
* [#25](https://github.com/mliebelt/pgn-parser/issues/25) Fixes problem with SAN, RAV and result in PGN.

## [1.1.4](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.1.4) 21-01-21

NPM trouble.

## [1.1.3](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.1.3) 20-12-30

### Changed
### Fixed

* [#24](https://github.com/mliebelt/pgn-parser/issues/24) Fixing whitespace problems.

## [1.1.2](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.1.2) 20-12-29

### Changed

* [#23](https://github.com/mliebelt/pgn-parser/issues/23) Add test case to demonstrate how to read one game.
* [#22](https://github.com/mliebelt/pgn-parser/issues/22) How to use library in the browser.
* [#21](https://github.com/mliebelt/pgn-parser/pull/21) Update Mocha (dependabot).
* [#20](https://github.com/mliebelt/pgn-parser/pull/20) Update Mocha (dependabot).
* [#19](https://github.com/mliebelt/pgn-parser/pull/19) Update Mocha (dependabot).
* [#18](https://github.com/mliebelt/pgn-parser/pull/18) Update Mocha (dependabot).
* [#17](https://github.com/mliebelt/pgn-parser/pull/17) Update Mocha (dependabot).
* [#16](https://github.com/mliebelt/pgn-parser/pull/16) Update Mocha (dependabot).
* [#15](https://github.com/mliebelt/pgn-parser/pull/15) Update Lodash (dependabot).

### Fixed

## [1.1.1](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.1.1) 20-06-17

NPM trouble.

## [1.1.0](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.1.0) 20-06-17

### Changed

* Updated `CHANGELOG.md` to include the latest changes.
* Updated `README.md` to explain how to use different start rules.
* Adding test cases missing.
* [12](https://github.com/mliebelt/pgn-parser/issues/12) New parse rule `games`. Incredible speed (>9.000 games in 2.5s).
* [#9](https://github.com/mliebelt/pgn-parser/issues/9) Working on tags, spelling, case ...
* [#14](https://github.com/mliebelt/pgn-parser/pull/14) Update Mocha (dependabot).

### Fixed

* [#13](https://github.com/mliebelt/pgn-parser/issues/13) Not necessary, closed therefore.
* [#12](https://github.com/mliebelt/pgn-parser/issues/12) Read many complete games.

## [1.0.1](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.0.1) 20-05-29

### Changed

* Removed doublequotes from the tags, because they are not included in the original spec.

### Fixed

## [1.0.0](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.0.0) 20-05-27

### Changed

* Migrated from expect to should.
* Top level rules are now game, pgn, tags.

### Fixed

* [#11](https://github.com/mliebelt/pgn-parser/issues/11) Read a complete game at once (tags and pgn).

## [0.10.0](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/0.10.0) 20-05-17

### Changed

* Added grammar for tags.
* Kept as default rule `pgn` to be backward compatible.
* Added Github workflow to check at each commit build and tests.
* Migrated to Mocha and Expect.

### Fixed

* [#1](https://github.com/mliebelt/pgn-parser/issues/1) Migrated all test cases to Mocha, developed mostly new ones.
* [#3](https://github.com/mliebelt/pgn-parser/issues/3) Provide a useful README to explain installation, usage, ...
* [#6](https://github.com/mliebelt/pgn-parser/issues/6) Integrates tags into the grammar.

## [0.9.9](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/0.9.9) 20-05-11

### Changed

### Fixed

* [#3](https://github.com/mliebelt/pgn-parser/issues/3) Provides a speaking nice `README.md` with sufficient information.
* [#1](https://github.com/mliebelt/pgn-parser/issues/1) Defined a lot of test cases to have the complete scope of the grammar.
* [#2](https://github.com/mliebelt/pgn-parser/issues/2) Automate the build of the generation of the parser.

## [0.9.8](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/0.9.8) 2019-05-10

Inital version, functional identical to file `PgnViewerJS/src/pgn-parser.js` (now deleted).

### Changed

* Made it buildable by NPM.
* Deployed that version as fully functional package that can be used by `npm i mliebelt@pgn-parser`.

### Fixed

Nothing