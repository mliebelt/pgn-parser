{
    function makeInteger(o) {
        return parseInt(o.join(""), 10);
    }
    function mi(o) {
        return o.join("").match(/\?/) ? o.join("") : makeInteger(o); }

  function merge(array) {
    var ret = {}
   // return array
    array.forEach(function(json) {
      for (var key in json) {
        if (Array.isArray(json[key])) {
            ret[key] = ret[key] ? ret[key].concat(json[key]) : json[key]
        } else {
            ret[key] = ret[key] ? trimEnd(ret[key]) + " " + trimStart(json[key]) : json[key]
        }
      }
    })
    return ret
  }

  function trimStart(st) {
    if (typeof st !== "string") return st
    var r=/^\s+/
    return st.replace(r,'')
  }

  function trimEnd(st) {
    if (typeof st !== "string") return st
    var r=/\s+$/
    return st.replace(r,'')
  }

}

games = ws games:(
       head:game
         tail:(ws m:game { return m; })*
         {
            //console.log("Length tail: " + tail.length);
            return [head].concat(tail) }
       )? {
            //console.log("Length: " + games.length);
            return games }

game = t:tags? c:comments? p:pgn
    {
      //console.log("Length pgn: " + p.length);
      return { tags: t, gameComment: c, moves: p }; }

tags = ws members:(
      head:tag
      tail:(ws m:tag { return m; })*
      {
        var result = {};
        [head].concat(tail).forEach(function(element) {
          result[element.name] = element.value;
        });
        return result;
      }
    )? ws
    { return members !== null ? members: {}; }


tag = bl ws tag:tagKeyValue ws br { return tag; }

tagKeyValue = eventKey ws value:string { return { name: 'Event', value: value }; }
	/ siteKey ws value:string  { return { name: 'Site', value: value }; }
	/ dateKey ws value:date  { return { name: 'Date', value: value }; }
	/ roundKey ws value:string  { return { name: 'Round', value: value }; }
	/ whiteTitleKey ws value:string  { return { name: 'WhiteTitle', value: value }; }
	/ blackTitleKey ws value:string  { return { name: 'BlackTitle', value: value }; }
	/ whiteEloKey ws value:integerOrDash  { return { name: 'WhiteELO', value: value }; }
	/ blackEloKey ws value:integerOrDash  { return { name: 'BlackELO', value: value }; }
	/ whiteUSCFKey ws value:integerString  { return { name: 'WhiteUSCF', value: value }; }
	/ blackUSCFKey ws value:integerString  { return { name: 'BlackUSCF', value: value }; }
	/ whiteNAKey ws value:string  { return { name: 'WhiteNA', value: value }; }
	/ blackNAKey ws value:string  { return { name: 'BlackNA', value: value }; }
	/ whiteTypeKey ws value:string  { return { name: 'WhiteType', value: value }; }
	/ blackTypeKey ws value:string  { return { name: 'BlackType', value: value }; }
	/ whiteKey ws value:string  { return { name: 'White', value: value }; }
	/ blackKey ws value:string  { return { name: 'Black', value: value }; }
	/ resultKey ws value:result  { return { name: 'Result', value: value }; }
	/ eventDateKey ws value:date  { return { name: 'EventDate', value: value }; }
	/ eventSponsorKey ws value:string  { return { name: 'EventSponsor', value: value }; }
	/ sectionKey ws value:string  { return { name: 'Section', value: value }; }
	/ stageKey ws value:string  { return { name: 'Stage', value: value }; }
	/ boardKey ws value:integerString  { return { name: 'Board', value: value }; }
	/ openingKey ws value:string  { return { name: 'Opening', value: value }; }
	/ variationKey ws value:string  { return { name: 'Variation', value: value }; }
	/ subVariationKey ws value:string  { return { name: 'SubVariation', value: value }; }
	/ ecoKey ws value:string  { return { name: 'ECO', value: value }; }
	/ nicKey ws value:string  { return { name: 'NIC', value: value }; }
	/ timeKey ws value:time  { return { name: 'Time', value: value }; }
	/ utcTimeKey ws value:time  { return { name: 'UTCTime', value: value }; }
	/ utcDateKey ws value:date  { return { name: 'UTCDate', value: value }; }
	/ timeControlKey ws value:timeControl  { return { name: 'TimeControl', value: value }; }
	/ setUpKey ws value:string  { return { name: 'SetUp', value: value }; }
	/ fenKey ws value:string  { return { name: 'FEN', value: value }; }
	/ terminationKey ws value:string  { return { name: 'Termination', value: value }; }
	/ anotatorKey ws value:string  { return { name: 'Annotator', value: value }; }
	/ modeKey ws value:string  { return { name: 'Mode', value: value }; }
	/ plyCountKey ws value:integerString  { return { name: 'PlyCount', value: value }; }
	/ variantKey ws value:string { return { name: 'Variant', value: value }; }
	/ whiteRatingDiffKey ws value:string { return { name: 'WhiteRatingDiff', value: value }; }
	/ blackRatingDiffKey ws value:string { return { name: 'BlackRatingDiff', value: value }; }
	/ whiteFideIdKey ws value:string { return { name: 'WhiteFideId', value: value }; }
	/ blackFideIdKey ws value:string { return { name: 'BlackFideId', value: value }; }
	/ whiteTeamKey ws value:string { return { name: 'WhiteTeam', value: value }; }
	/ blackTeamKey ws value:string { return { name: 'BlackTeam', value: value }; }
	/ ! validatedKey a:anyKey ws value:string { return { name: a, value: value }; }
/*	/ ! validatedKey a:anyKey ws value:string { console.log('Unknown Key: ' + a); return { name: a, value: value }; } */

validatedKey  = dateKey / whiteEloKey / blackEloKey / whiteUSCFKey / blackUSCFKey / resultKey / eventDateKey / boardKey /
        timeKey / utcTimeKey / utcDateKey / timeControlKey / plyCountKey

eventKey 				=  'Event' / 'event'
siteKey 				=  'Site' / 'site'
dateKey 				=  'Date' / 'date'
roundKey				=  'Round' / 'round'
whiteKey 				=  'White' / 'white'
blackKey 				=  'Black' / 'black'
resultKey 				=  'Result' / 'result'
whiteTitleKey           =  'WhiteTitle' / 'Whitetitle' / 'whitetitle' / 'whiteTitle'
blackTitleKey           =  'BlackTitle' / 'Blacktitle' / 'blacktitle' / 'blackTitle'
whiteEloKey             =  'WhiteELO' / 'WhiteElo' / 'Whiteelo' / 'whiteelo' / 'whiteElo'
blackEloKey             =  'BlackELO' / 'BlackElo' / 'Blackelo' / 'blackelo' / 'blackElo'
whiteUSCFKey            =  'WhiteUSCF' / 'WhiteUscf' / 'Whiteuscf' / 'whiteuscf' / 'whiteUscf'
blackUSCFKey            =  'BlackUSCF' / 'BlackUscf' / 'Blackuscf' / 'blackuscf' / 'blackUscf'
whiteNAKey              =  'WhiteNA' / 'WhiteNa' / 'Whitena' / 'whitena' / 'whiteNa' / 'whiteNA'
blackNAKey              =  'BlackNA' / 'BlackNa' / 'Blackna' / 'blackna' / 'blackNA' / 'blackNa'
whiteTypeKey            =  'WhiteType' / 'Whitetype' / 'whitetype' / 'whiteType'
blackTypeKey            =  'BlackType' / 'Blacktype' / 'blacktype' / 'blackType'
eventDateKey            =  'EventDate' / 'Eventdate' / 'eventdate' / 'eventDate'
eventSponsorKey         =  'EventSponsor' / 'Eventsponsor' / 'eventsponsor' / 'eventSponsor'
sectionKey              =  'Section' / 'section'
stageKey                =  'Stage' / 'stage'
boardKey                =  'Board' / 'board'
openingKey              =  'Opening' / 'opening'
variationKey            =  'Variation' / 'variation'
subVariationKey         =  'SubVariation' / 'Subvariation' / 'subvariation' / 'subVariation'
ecoKey                  =  'ECO' / 'Eco' / 'eco'
nicKey                  =  'NIC' / 'Nic' / 'nic'
timeKey                 =  'Time' / 'time'
utcTimeKey              =  'UTCTime' / 'UTCtime' / 'UtcTime' / 'Utctime' / 'utctime' / 'utcTime'
utcDateKey              =  'UTCDate' / 'UTCdate' / 'UtcDate' / 'Utcdate' / 'utcdate' / 'utcDate'
timeControlKey          =  'TimeControl' / 'Timecontrol' / 'timecontrol' / 'timeControl'
setUpKey                =  'SetUp' / 'Setup' / 'setup' / 'setUp'
fenKey                  =  'FEN' / 'Fen' / 'fen'
terminationKey          =  'Termination'  / 'termination'
anotatorKey             =  'Annotator'  / 'annotator'
modeKey                 =  'Mode' / 'mode'
plyCountKey             =  'PlyCount'  / 'Plycount' / 'plycount' / 'plyCount'
variantKey              =  'Variant' / 'variant'
whiteRatingDiffKey      =  'WhiteRatingDiff'
blackRatingDiffKey      =  'BlackRatingDiff'
whiteFideIdKey          =  'WhiteFideId'
blackFideIdKey          =  'BlackFideId'
whiteTeamKey            =  'WhiteTeam'
blackTeamKey            =  'BlackTeam'
anyKey                  =  stringNoQuot


ws "whitespace" = [ \t\n\r]*
wsp = [ \t\n\r]+
eol = [\n\r]+

string "string"
  = quotation_mark chars:char* quotation_mark { return chars.join(""); }

stringNoQuot
  = chars:[-a-zA-Z0-9.]* { return chars.join(""); }

quotation_mark
  = '"'

char  = [^\0-\x1F\x22\x5C]

date = quotation_mark year:([0-9\?] [0-9\?] [0-9\?] [0-9\?]) '.' month:([0-9\?] [0-9\?]) '.' day:([0-9\?] [0-9\?]) quotation_mark
	{ let val = "" + year.join("") + '.' + month.join("") + '.' + day.join("");
	    return { value: val, year: mi(year), month: mi(month), day: mi(day) }; }

time = quotation_mark hour:([0-9]+) ':' minute:([0-9]+) ':' second:([0-9]+) quotation_mark
    { let val = hour.join("") + ':' + minute.join("") + ':' + second.join("");
        return { value: val, hour: mi(hour), minute: mi(minute), second: mi(second) }; }

timeControl = quotation_mark res:tcnq quotation_mark    { return res; }
tcnq = '?' { return { kind: 'unknown', value: '?' }; }
    / '-' { return { kind: 'unlimited', value: '-' }; }
    / moves:integer "/" seconds:integer { return { kind: 'movesInSeconds', moves: moves, seconds: seconds }; }
    / seconds:integer '+' incr:integer { return { kind: 'increment', seconds: seconds, increment: incr }; }
    / seconds:integer { return { kind: 'suddenDeath', seconds: seconds }; }
    / '*' seconds:integer { return { kind: 'hourglass', seconds: seconds }; }

result = quotation_mark res:innerResult quotation_mark { return res; }
innerResult =
	res:"1-0" {return res; }
    / res:"0-1" { return res; }
    / res:"1/2-1/2" { return res; }
    / res:"*" { return res; }

integerOrDash =
 	integerString
    / quotation_mark '-' quotation_mark

integerString =
	quotation_mark digits:[0-9]+ quotation_mark { return makeInteger(digits); }

pgn
  = ws pw:pgnStartWhite
      { return pw; }
  / ws pb:pgnStartBlack
    { return pb; }

pgnStartWhite
  = pw:pgnWhite ws { return pw; }

pgnStartBlack
  = pb:pgnBlack ws { return pb; }

pgnWhite
  = ws cm:comments? ws mn:moveNumber? ws hm:halfMove  ws nag:nags?  ws ca:comments? ws vari:variationWhite? all:pgnBlack?
    { var arr = (all ? all : []);
      var move = {}; move.turn = 'w'; move.moveNumber = mn; move.notation = hm;
      if (ca) { move.commentAfter = ca.comment };
      if (cm) { move.commentMove = cm.comment };
      move.variations = (vari ? vari : []); move.nag = (nag ? nag : null); arr.unshift(move); 
      move.commentDiag = ca;
      return arr; }
  / ws e:endGame ws {return e; }

pgnBlack
  = ws cm:comments? ws me:moveNumber? ws hm:halfMove ws nag:nags? ws ca:comments? ws ws vari:variationBlack? all:pgnWhite?
    { var arr = (all ? all : []);
      var move = {}; move.turn = 'b'; move.moveNumber = me; move.notation = hm;
      if (ca) { move.commentAfter = ca.comment };
      if (cm) { move.commentMove = cm.comment };
      move.variations = (vari ? vari : []); arr.unshift(move); move.nag = (nag ? nag : null);
      move.commentDiag = ca;
      return arr; }
  / ws e:endGame ws { return e; }

endGame
  = eg:innerResult { return [eg]; }

comments
  = cf:comment cfl:(ws c:comment { return c })*
  { return merge([cf].concat(cfl)) }

comment
  = cl cm:innerComment cr { return cm;}
  / cm:commentEndOfLine { return { comment: cm}; }

innerComment
  = ws bl "%csl" wsp cf:colorFields ws br ws tail:(ic:innerComment { return ic })*
      { return merge([{ colorFields: cf }].concat(tail[0])) }
  / ws bl "%cal" wsp ca:colorArrows ws br ws tail:(ic:innerComment { return ic })*
      { return merge([{ colorArrows: ca }].concat(tail[0])) }
  / ws bl "%" cc:clockCommand wsp cv:clockValue ws br ws tail:(ic:innerComment { return ic })*
      { var ret = {}; ret[cc]= cv; return merge([ret].concat(tail[0])) }
  / ws bl "%eval" wsp ev:stringNoQuot ws br ws tail:(ic:innerComment { return ic })*
      { var ret = {};  ret["eval"]= parseFloat(ev); return merge([ret].concat(tail[0])) }
  / ws bl "%" ac:stringNoQuot wsp nbr+ br ws tail:(ic:innerComment { return ic })*
      { return tail[0] }
  / c:nonCommand+ tail:(ws ic:innerComment { return ic })*
      { if (tail.length > 0) { return merge([{ comment: trimEnd(c.join("")) }].concat(trimStart(tail[0]))) }
        else { return { comment: c.join("") } } }

nonCommand
  = !"[%" !"}" char:. { return char; }

nbr
  = !br char:. { return char; }

commentEndOfLine
  = semicolon cm:[^\n\r]* eol { return cm.join(""); }

colorFields
  = cf:colorField ws cfl:("," ws colorField)*
  { var arr = []; arr.push(cf); for (var i=0; i < cfl.length; i++) { arr.push(cfl[i][2])}; return arr; }

colorField
  = col:color f:field { return col + f; }

colorArrows
  = cf:colorArrow ws cfl:("," ws colorArrow)*
  { var arr = []; arr.push(cf); for (var i=0; i < cfl.length; i++) { arr.push(cfl[i][2])}; return arr; }

colorArrow
  = col:color ff:field ft:field { return col + ff + ft; }

color
  = "Y" { return "Y"; } // yellow
  / "G" { return "G"; } // green
  / "R" { return "R"; } // red
  / "B" { return "B"; } // blue

field
  = col:column row:row { return col + row; }

cl = '{'

cr = '}'

bl = '['

br = ']'

semicolon = ';'

clockCommand
  = "clk" { return "clk"; }
  / "egt" { return "egt"; }
  / "emt" { return "emt"; }
  / "mct" { return "mct"; }

clockValue
  = h1:digit h2:digit? ":" m1:digit m2:digit ":" s1:digit s2:digit
  { var ret = h1; if (h2) { ret += h2 }; ret += ":" + m1 + m2 + ":" + s1 + s2; return ret; }

digit
  = d:[0-9] { return d; }

variationWhite
  = pl vari:pgnWhite pr ws all:variationWhite?
    { var arr = (all ? all : []); arr.unshift(vari); return arr; }

variationBlack
  = pl vari:pgnStartBlack pr ws all:variationBlack?
    { var arr = (all ? all : []); arr.unshift(vari); return arr; }

pl = '('

pr = ')'

moveNumber
    = num:integer whiteSpace* dot* { return num; }

dot = "."

integer "integer"
    = digits:[0-9]+ { return makeInteger(digits); }

whiteSpace
    = " "+ { return '';}

halfMove
  = fig:figure? & checkdisc disc:discriminator str:strike?
    col:column row:row pr:promotion? ch:check?
    { var hm = {}; hm.fig = (fig ? fig : null); hm.disc =  (disc ? disc : null); hm.strike = (str ? str : null); hm.col = col; hm.row = row; hm.check = (ch ? ch : null); hm.promotion = pr; hm.notation = (fig ? fig : "") + (disc ? disc : "") + (str ? str : "") + col + row + (pr ? pr : "") + (ch ? ch : ""); return hm; }
  / fig:figure? cols:column rows:row str:strikeOrDash? col:column row:row pr:promotion? ch:check?
    { var hm = {}; hm.fig = (fig ? fig : null); hm.strike = (str =='x' ? str : null); hm.col = col; hm.row = row; hm.check = (ch ? ch : null); hm.notation = (fig && (fig!=='P') ? fig : "") + cols + rows + (str=='x' ? str : "-") + col  + row + (pr ? pr : "") + (ch ? ch : ""); hm.promotion = pr; return hm; }
  / fig:figure? str:strike? col:column row:row pr:promotion? ch:check?
    { var hm = {}; hm.fig = (fig ? fig : null); hm.strike = (str ? str : null); hm.col = col; hm.row = row; hm.check = (ch ? ch : null); hm.notation = (fig ? fig : "") + (str ? str : "") + col  + row + (pr ? pr : "") + (ch ? ch : ""); hm.promotion = pr; return hm; }
  / 'O-O-O' ch:check? { var hm = {}; hm.notation = 'O-O-O'+ (ch ? ch : ""); hm.check = (ch ? ch : null); return  hm; }
  / 'O-O' ch:check? { var hm = {}; hm.notation = 'O-O'+ (ch ? ch : ""); hm.check = (ch ? ch : null); return  hm; }
  / fig:figure '@' col:column row:row
    { var hm = {}; hm.fig = fig; hm.drop = true; hm.col = col; hm.row = row; hm.notation = fig + '@' + col + row; return hm; }

check
  = ch:(! '+-' '+') { return ch[1]; }
  / ch:(! '$$$' '#') { return ch[1]; }

promotion
  = '=' f:promFigure { return '=' + f; }

nags
  = nag:nag ws nags:nags? { var arr = (nags ? nags : []); arr.unshift(nag); return arr; }

nag
  = '$' num:integer { return '$' + num; }
  / '!!' { return '$3'; }
  / '??' { return '$4'; }
  / '!?' { return '$5'; }
  / '?!' { return '$6'; }
  / '!' { return '$1'; }
  / '?' { return '$2'; }
  / '‼' { return '$3'; }
  / '⁇' { return '$4'; }
  / '⁉' { return '$5'; }
  / '⁈' { return '$6'; }
  / '□' { return '$7'; }
  / '=' { return '$10'; }
  / '∞' { return '$13'; }
  / '⩲' { return '$14'; }
  / '⩱' { return '$15';}
  / '±' { return '$16';}
  / '∓' { return '$17';}
  / '+-' { return '$18';}
  / '-+' { return '$19';}
  / '⨀' { return '$22'; }
  / '⟳' { return '$32'; }
  / '→' { return '$36'; }
  / '↑' { return '$40'; }
  / '⇆' { return '$132'; }
  / 'D' { return '$220'; }

discriminator
  = column
  / row


checkdisc
  = discriminator strike? column row

figure
  = [RNBQKP]

promFigure
  = [RNBQ]

column
  = [a-h]

row
  = [1-8]

strike
  = 'x'

strikeOrDash
  = 'x'
  / '-'