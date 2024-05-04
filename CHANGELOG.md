# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Not released

### Changed

### Fixed

## [1.4.15](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.4.15) 24-05-04

### Changed

* [#488](https://github.com/mliebelt/pgn-parser/issues/488) Migrated from mocha tests to uvu

### Fixed

* [#528](https://github.com/mliebelt/pgn-parser/issues/528) Fix strange chessjs format of move numbers (`11. ... Rd8`)

## [1.4.14](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.4.14) 24-01-03

### Changed

* [#463](https://github.com/mliebelt/pgn-parser/issues/463) Document handling of additional characters in PGN (which may be interpreted as move)
* [#444](https://github.com/mliebelt/pgn-parser/issues/444) Upgrade to Typescript 5.3.2

### Fixed

* [#462](https://github.com/mliebelt/pgn-parser/issues/462) Fix wrong handling with multiple newline characters doing the split

## [1.4.13](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.4.13) 23-11-18

### Changed

* [#439](https://github.com/mliebelt/pgn-parser/issues/439) Remove support for node 14
* [#430](https://github.com/mliebelt/pgn-parser/issues/430) Allow 1/2 as valid result
* [#436](https://github.com/mliebelt/pgn-parser/issues/436) Allow Z0 as empty move in PGN
* [#391](https://github.com/mliebelt/pgn-parser/issues/391) Allow additional colors from chess.com

### Fixed

## [1.4.12](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.4.12) 23-05-29

### Changed

* [#349](https://github.com/mliebelt/pgn-parser/issues/349) Allow BOM in PGN (exported by Chessbase)

### Fixed

## [1.4.11](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.4.11) 23-05-10

### Changed

* [#365](https://github.com/mliebelt/pgn-parser/issues/365) Have TimeControl string as value after parsing

## [1.4.9](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.4.9) 23-05-07

### Changed

* [#362](https://github.com/mliebelt/pgn-parser/issues/362) Allow chess.com commentary (ignored then)

### Fixed

## [1.4.6](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.4.6) 23-02-02

### Changed

* [#332](https://github.com/mliebelt/pgn-parser/issues/332) Added `pgn-types`

### Fixed

* [#333](https://github.com/mliebelt/pgn-parser/issues/333) Fixes some problems with combinations of circle and arrows in comments

## [1.4.5](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.4.5) 22-11-05

### Changed

### Fixed

* [#309](https://github.com/mliebelt/pgn-parser/issues/309) Allow escaped doublequotes inside tags
* [#312](https://github.com/mliebelt/pgn-parser/issues/312) Fixed Typescript errors in imports

## [1.4.4](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.4.4) 22-02-09

### Changed

* [#100](https://github.com/mliebelt/pgn-parser/issues/100) Cleanup of unnecessary `@ts-ignore`

### Fixed

* [#162](https://github.com/mliebelt/pgn-parser/issues/162) Export SyntaxError

## [1.4.3](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.4.3) 22-01-29

### Changed

### Fixed

* [#136](https://github.com/mliebelt/pgn-parser/issues/136) Final solution: use UMD only, provide examples for different contexts

## [1.4.2](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.4.2) 22-01-21

### Changed

### Fixed

* [#136](https://github.com/mliebelt/pgn-parser/issues/136) README, additional examples
* [#137](https://github.com/mliebelt/pgn-parser/issues/137) Fix import, change in API
* [#144](https://github.com/mliebelt/pgn-parser/issues/144) First try to fix build: rollup

## [1.4.1](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.4.1) 22-01-06

### Changed

* [#99](https://github.com/mliebelt/pgn-parser/issues/99) Result in SAN is kept as tag
* [#57](https://github.com/mliebelt/pgn-parser/issues/57) Add draw offer to notation
* [#113](https://github.com/mliebelt/pgn-parser/issues/113) Allow 'e.p.' when parsing
* [#114](https://github.com/mliebelt/pgn-parser/issues/114) Allow leaving out '=' when promoting
* [#117](https://github.com/mliebelt/pgn-parser/issues/117) Combine `movesInSeconds` with `increment` TimeControl

### Fixed

* [#83](https://github.com/mliebelt/pgn-parser/issues/83) Set ELO to 0 if not set
* [#101](https://github.com/mliebelt/pgn-parser/issues/101) Be robust with unknown TimeControl tag
* [#116](https://github.com/mliebelt/pgn-parser/issues/116) Allow more than 1 period in TimeFormat

## [1.4.0](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.4.0) 21-11-16

### Changed

* [#100](https://github.com/mliebelt/pgn-parser/issues/100) Switched source language to Typescript
* [#102](https://github.com/mliebelt/pgn-parser/issues/102) Deployed new version

### Fixed

## [1.3.7](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.3.7) 21-11-16

### Changed

* [#102](https://github.com/mliebelt/pgn-parser/issues/102) Fix for bug when using library in strict mode

### Fixed

## [1.3.6](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.3.6) 21-11-16

### Changed

### Fixed

* [#97](https://github.com/mliebelt/pgn-parser/issues/97) Fix for bug when using library in strict mode

## [1.3.5](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.3.5) 21-08-15

### Fixed

### Changed

* [#74](https://github.com/mliebelt/pgn-parser/issues/74) First working split solution
* [#80](https://github.com/mliebelt/pgn-parser/issues/80) Cleanup code for splitting
* [#90](https://github.com/mliebelt/pgn-parser/issues/90) Allow arbitrary action commands, keep the values

### Fixed

## [1.3.4](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.3.4) 21-06-21

### Changed

### Fixed

* [#65](https://github.com/mliebelt/pgn-parser/issues/65) Fixed reset of messages

# [1.3.3](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.3.3) 21-06-21

### Changed

* [#63](https://github.com/mliebelt/pgn-parser/issues/63) Added tags for Clock, WhiteClock, BlackClock

### Fixed

## [1.3.2](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.3.2) 21-06-03

### Changed

* [#59](https://github.com/mliebelt/pgn-parser/issues/59) Switches from pegjs to peggy
* [#64](https://github.com/mliebelt/pgn-parser/issues/64) Bump peggy to version 1.2.0

### Fixed

* [#55](https://github.com/mliebelt/pgn-parser/issues/55) Be more resilient with clock annotations

## [1.3.1](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.3.1) 21-05-30

### Changed

### Fixed

* [#62](https://github.com/mliebelt/pgn-parser/issues/62) Don't record turn if not known

## [1.3.0](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.3.0) 21-05-30

### Changed

### Fixed

* [#58](https://github.com/mliebelt/pgn-parser/issues/58) Wrong date now recorded as message, not as parse error

## [1.2.8](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.2.8) 21-04-30

### Changed

* [#54](https://github.com/mliebelt/pgn-parser/issues/54) Add drop notation for crazyhouse

### Fixed

## [1.2.7](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.2.7) 21-04-18

### Changed

### Fixed

* [#52](https://github.com/mliebelt/pgn-parser/issues/52) Allow additional whitespace in tags

## [1.2.6](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.2.6) 21-04-13

### Changed

### Fixed

* [#41](https://github.com/mliebelt/pgn-parser/issues/41) Comment `%eval` reads now a number

## [1.2.5](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.2.5) 21-04-06

### Changed

* [#51](https://github.com/mliebelt/pgn-parser/issues/51) Allow any additional tags

### Fixed

## [1.2.4](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.2.4) 21-04-03

### Changed

* [#45](https://github.com/mliebelt/pgn-parser/issues/45) Refactoring of unit tests
* [#46](https://github.com/mliebelt/pgn-parser/issues/46) Implemented all date and time tags with correct structure
* [#47](https://github.com/mliebelt/pgn-parser/issues/47) Implemented TimeControl fully to the spec
* [#49](https://github.com/mliebelt/pgn-parser/issues/49) Add additional lichess tags to avoid errors

### Fixed

* [#44](https://github.com/mliebelt/pgn-parser/issues/44) Fix for race conditions when having games without whitespace in between

## [1.2.3](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.2.3) 21-03-30

### Changed

### Fixed

* [#43](https://github.com/mliebelt/pgn-parser/issues/43) Fix for race conditions when having games without whitespace in between

## [1.2.2](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.2.2) 21-03-30

### Changed

### Fixed

* [#42](https://github.com/mliebelt/pgn-parser/issues/42) Ignores whitespace between comments

## [1.2.1](https://www.npmjs.com/package/@mliebelt/pgn-parser/v/1.2.1) 21-03-26

### Changed

### Fixed

* [#40](https://github.com/mliebelt/pgn-parser/issues/40) Ignore unknown actions in comments like `1. e4 {[%foo 1.01]}`.
* [#41](https://github.com/mliebelt/pgn-parser/issues/41) Read eval comments and store in `commentDiags`lock.

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

Inital version, functional identical to file `PgnViewerJS/src/pgn-parser.ts` (now deleted).

### Changed

* Made it buildable by NPM.
* Deployed that version as fully functional package that can be used by `npm i mliebelt@pgn-parser`.

### Fixed

Nothing