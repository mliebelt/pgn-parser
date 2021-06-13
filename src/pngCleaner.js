// const notUsedRegex = /[\x7F-\x9F]/g;
// const discouragedRegex = /[\xA0-\xBF]/g;
// const extendedRegex = /[\xC0-\xFF]/g;
// const mainCharRegex = /[\x20-\x7E]/g;
// horizontal and vertical tabs along with the linefeed and carriage return codes
// horizontal, linefeed, vertical = \x09-\x0B
// carriage = \x0D
// const controlRegex = /[\x00-\x08\x0C\x0E-\x1F]/g;
const moveRegex = /[\d*a-hxRNBQKPO.=/#∓±? \r\n+-]/;
const variationRegex = /[\d*a-hxRNBQKPO.=/#∓±? \r\n+-]/;

// this combines the notUsedRegex and controlRegex
const isInvalid = (str) => !(/[\x00-\x08\x0C\x0E-\x1F\x7F-\x9F]/.test(str));
// allows anything not allowed by isInvalid
const isValidComment = (str) => isInvalid(str);
// allows anything not allowed by isInvalid
const isValidTag = (str) => isInvalid(str);
// allows anything that should be a valid move notation but not sure if 100% inclusive
const isValidMove = (str) => moveRegex.test(str)
// same as isValidMove but seperated for future changes?
const isValidVariation = (str) => variationRegex.test(str)

const clean = (pgn) => {
    let inTag = false;
    let inComment = false;
    let inVariation = false;
    return pgn.split('').map((c, i) => {
        if (inComment) {
            if (c === '}') {
                inComment = false;
                return c;
            }
            if (isValidComment(c)) return c
        }
        if (!inTag && !inComment && c === '{') {
            inComment = true;
            return c;
        }
        if (inTag) {
            if (c === ']' && inTag) {
                inTag = false;
                return c
            }
            if (isValidTag(c)) return c
        }
        if (!inTag && !inComment && !inVariation && c === '[') {
            inTag = true;
            return c;
        }
        if (!inTag && !inComment && !inVariation && c === '(') {
            inVariation = true;
            return c;
        }
        if (c === ')' && inVariation) {
            inVariation = false
            return c
        }
        // checking variation separate from non-variation as it is less strict?
        if (!inTag && !inComment && inVariation) {
            if (isValidVariation(c)) return c
            console.log(`variation cleaning: ${c} at index: ${i}`);
            return '';
        }
        if (isValidMove(c)) return c
        console.log(`cleaning: ${c} at index: ${i}`);
        return '';
    }).join('').replace(/\\\\/g, '');
};

module.exports = clean