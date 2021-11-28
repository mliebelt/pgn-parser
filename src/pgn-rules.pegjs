{
    var messages = [];

    function addMessage(json) {
        var o = Object.assign(json, location()); messages.push(o); return o;
    }

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
            return games; }

game = t:tags? c:comments? p:pgn
    {
      //console.log("Length pgn: " + p.length);
      var mess = messages; messages = [];
      return { tags: t, gameComment: c, moves: p, messages: mess }; }

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
    { if (members === null) return {};
      members.messages = messages; return members;}


tag = bl ws tag:tagKeyValue ws br { return tag; }

tagKeyValue = eventKey ws value:string { return { name: 'Event', value: value }; }
	/ siteKey ws value:string  { return { name: 'Site', value: value }; }
	/ dateKey ws value:dateString  { return { name: 'Date', value: value }; }
	/ roundKey ws value:string  { return { name: 'Round', value: value }; }
	/ whiteTitleKey ws value:string  { return { name: 'WhiteTitle', value: value }; }
	/ blackTitleKey ws value:string  { return { name: 'BlackTitle', value: value }; }
	/ whiteEloKey ws value:integerOrDashString  { return { name: 'WhiteElo', value: value }; }
	/ blackEloKey ws value:integerOrDashString  { return { name: 'BlackElo', value: value }; }
	/ whiteUSCFKey ws value:integerString  { return { name: 'WhiteUSCF', value: value }; }
	/ blackUSCFKey ws value:integerString  { return { name: 'BlackUSCF', value: value }; }
	/ whiteNAKey ws value:string  { return { name: 'WhiteNA', value: value }; }
	/ blackNAKey ws value:string  { return { name: 'BlackNA', value: value }; }
	/ whiteTypeKey ws value:string  { return { name: 'WhiteType', value: value }; }
	/ blackTypeKey ws value:string  { return { name: 'BlackType', value: value }; }
	/ whiteKey ws value:string  { return { name: 'White', value: value }; }
	/ blackKey ws value:string  { return { name: 'Black', value: value }; }
	/ resultKey ws value:result  { return { name: 'Result', value: value }; }
	/ eventDateKey ws value:dateString  { return { name: 'EventDate', value: value }; }
	/ eventSponsorKey ws value:string  { return { name: 'EventSponsor', value: value }; }
	/ sectionKey ws value:string  { return { name: 'Section', value: value }; }
	/ stageKey ws value:string  { return { name: 'Stage', value: value }; }
	/ boardKey ws value:integerString  { return { name: 'Board', value: value }; }
	/ openingKey ws value:string  { return { name: 'Opening', value: value }; }
	/ variationKey ws value:string  { return { name: 'Variation', value: value }; }
	/ subVariationKey ws value:string  { return { name: 'SubVariation', value: value }; }
	/ ecoKey ws value:string  { return { name: 'ECO', value: value }; }
	/ nicKey ws value:string  { return { name: 'NIC', value: value }; }
	/ timeKey ws value:timeString  { return { name: 'Time', value: value }; }
	/ utcTimeKey ws value:timeString  { return { name: 'UTCTime', value: value }; }
	/ utcDateKey ws value:dateString  { return { name: 'UTCDate', value: value }; }
	/ timeControlKey ws value:timeControl  { return { name: 'TimeControl', value: value }; }
	/ setUpKey ws value:string  { return { name: 'SetUp', value: value }; }
	/ fenKey ws value:string  { return { name: 'FEN', value: value }; }
	/ terminationKey ws value:string  { return { name: 'Termination', value: value }; }
	/ annotatorKey ws value:string  { return { name: 'Annotator', value: value }; }
	/ modeKey ws value:string  { return { name: 'Mode', value: value }; }
	/ plyCountKey ws value:integerString  { return { name: 'PlyCount', value: value }; }
	/ variantKey ws value:string { return { name: 'Variant', value: value }; }
	/ whiteRatingDiffKey ws value:string { return { name: 'WhiteRatingDiff', value: value }; }
	/ blackRatingDiffKey ws value:string { return { name: 'BlackRatingDiff', value: value }; }
	/ whiteFideIdKey ws value:string { return { name: 'WhiteFideId', value: value }; }
	/ blackFideIdKey ws value:string { return { name: 'BlackFideId', value: value }; }
	/ whiteTeamKey ws value:string { return { name: 'WhiteTeam', value: value }; }
	/ blackTeamKey ws value:string { return { name: 'BlackTeam', value: value }; }
	/ clockKey ws value:colorClockTimeQ { return { name: 'Clock', value: value }; }
	/ whiteClockKey ws value:clockTimeQ { return { name: 'WhiteClock', value: value }; }
	/ blackClockKey ws value:clockTimeQ { return { name: 'BlackClock', value: value }; }
	/ & validatedKey a:anyKey ws value:string
	      { addMessage( {key: a, value: value, message: `Format of tag: "${a}" not correct: "${value}"`} );
	        return { name: a, value: value }; }
	/ ! validatedKey a:anyKey ws value:string
	    { addMessage( {key: a, value: value, message: `Tag: "${a}" not known: "${value}"`} );
	      return { name: a, value: value }; }
/*	/ ! validatedKey a:a ws value:string { console.log('Unknown Key: ' + a); return { name: a, value: value }; } */

validatedKey  = dateKey / whiteEloKey / blackEloKey / whiteUSCFKey / blackUSCFKey / resultKey / eventDateKey / boardKey /
        timeKey / utcTimeKey / utcDateKey / timeControlKey / plyCountKey / clockKey / whiteClockKey / blackClockKey

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
annotatorKey             =  'Annotator'  / 'annotator'
modeKey                 =  'Mode' / 'mode'
plyCountKey             =  'PlyCount'  / 'Plycount' / 'plycount' / 'plyCount'
variantKey              =  'Variant' / 'variant'
whiteRatingDiffKey      =  'WhiteRatingDiff'
blackRatingDiffKey      =  'BlackRatingDiff'
whiteFideIdKey          =  'WhiteFideId'
blackFideIdKey          =  'BlackFideId'
whiteTeamKey            =  'WhiteTeam'
blackTeamKey            =  'BlackTeam'
clockKey                =  'Clock'
whiteClockKey           =  'WhiteClock'
blackClockKey           =  'BlackClock'
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

char
  = !quotation_mark char:. { return char; }

dateString = quotation_mark year:([0-9\?] [0-9\?] [0-9\?] [0-9\?]) '.' month:([0-9\?] [0-9\?]) '.' day:([0-9\?] [0-9\?]) quotation_mark
	{ let val = "" + year.join("") + '.' + month.join("") + '.' + day.join("");
	    return { value: val, year: mi(year), month: mi(month), day: mi(day) }; }

timeString = quotation_mark hour:([0-9]+) ':' minute:([0-9]+) ':' second:([0-9]+) millis:millis? quotation_mark
    { let val = hour.join("") + ':' + minute.join("") + ':' + second.join(""); let ms = 0;
      if (millis) {
         val = val + '.' + millis;
         addMessage({ message: `Unusual use of millis in time: ${val}` });
         mi(millis);
      }
      return { value: val, hour: mi(hour), minute: mi(minute), second: mi(second), millis: ms }; }
millis = '.' millis:([0-9]+) { return millis.join(""); }

colorClockTimeQ = quotation_mark value:colorClockTime quotation_mark { return value; }
colorClockTime = c:clockColor '/' t:clockTime { return c + '/' + t; }
clockColor = 'B' / 'W' / 'N'

clockTimeQ = quotation_mark value:clockTime quotation_mark { return value; }
clockTime = value:clockValue1D { return value; }

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

integerOrDashString =
 	v:integerString { return v }
    / quotation_mark '-' quotation_mark {return 0 }
    / quotation_mark quotation_mark { addMessage({ message: 'Use "-" for an unknown value'}); return 0 }

integerString =
	quotation_mark digits:[0-9]+ quotation_mark { return makeInteger(digits); }

pgn
  = ws cm:comments? ws mn:moveNumber? ws hm:halfMove  ws nag:nags?  dr:drawOffer? ws ca:comments? ws vari:variation? all:pgn?
    { var arr = (all ? all : []);
      var move = {}; move.moveNumber = mn; move.notation = hm;
      if (ca) { move.commentAfter = ca.comment };
      if (cm) { move.commentMove = cm.comment };
      if (dr) { move.drawOffer = true };
      move.variations = (vari ? vari : []); move.nag = (nag ? nag : null); arr.unshift(move); 
      move.commentDiag = ca;
      return arr; }
  / ws e:endGame ws {return e; }

drawOffer
  = pl '=' pr

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
  / ws bl "%" cc:clockCommand1D wsp cv:clockValue1D ws br ws tail:(ic:innerComment { return ic })*
      { var ret = {}; ret[cc]= cv; return merge([ret].concat(tail[0])) }
  / ws bl "%" cc:clockCommand2D wsp cv:clockValue2D ws br ws tail:(ic:innerComment { return ic })*
      { var ret = {}; ret[cc]= cv; return merge([ret].concat(tail[0])) }
  / ws bl "%eval" wsp ev:stringNoQuot ws br ws tail:(ic:innerComment { return ic })*
      { var ret = {};  ret["eval"]= parseFloat(ev); return merge([ret].concat(tail[0])) }
  / ws bl "%" ac:stringNoQuot wsp val:nbr+ br ws tail:(ic:innerComment { return ic })*
      { var ret = {}; ret[ac]= val.join(""); return merge([ret].concat(tail[0])) }
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

clockCommand1D
  = "clk" { return "clk"; }
  / "egt" { return "egt"; }
  / "emt" { return "emt"; }

clockCommand2D
  = "mct" { return "mct"; }

clockValue1D
  = hm:hoursMinutes? s1:digit s2:digit? millis:millis?
  { let ret = s1;
    if (!hm) { addMessage({ message: `Hours and minutes missing`}) } else { ret = hm + ret }
    if (hm && ((hm.match(/:/g) || []).length == 2)) {
          if (hm.search(':') == 2) { addMessage({ message: `Only 1 digit for hours normally used`}) }
        }
    if (!s2) { addMessage({ message: `Only 2 digit for seconds normally used`}) } else { ret += s2 }
    if (millis) { addMessage({ message: `Unusual use of millis in clock value`}); ret += '.' + millis }
    return ret; }

clockValue2D
  = hm:hoursMinutes? s1:digit s2:digit?
  { let ret = s1;
    if (!hm) { addMessage({ message: `Hours and minutes missing`}) } else { ret = hm + ret }
    if (hm && ((hm.match(/:/g) || []).length == 2)) {
      if (hm.search(':') == 1) { addMessage({ message: `Only 2 digits for hours normally used`}) }
    }
    if (!s2) { addMessage({ message: `Only 2 digit for seconds normally used`}) } else { ret += s2 }
    return ret; }

hoursMinutes
  = hours:hoursClock minutes:minutesClock?
    { if (!minutes) {
          addMessage({ message: `No hours found`}); return hours }
      return hours + minutes; }

hoursClock
  = h1:digit h2:digit? ":"
  { let ret = h1;
    if (h2) {
      ret += h2 + ":";
    } else { ret += ":" }
    return ret; }

minutesClock
  = m1:digit m2:digit? ":"
  { let ret = m1;
    if (m2) { ret += m2 + ":"; }
    else { ret += ":"; addMessage({ message: `Only 2 digits for minutes normally used`}) }
    return ret; }

digit
  = d:[0-9] { return d; }

variation
  = pl vari:pgn pr ws all:variation?
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
    col:column row:row pr:promotion? ch:check? ws 'e.p.'?
    { var hm = {}; hm.fig = (fig ? fig : null); hm.disc =  (disc ? disc : null); hm.strike = (str ? str : null);
    hm.col = col; hm.row = row; hm.check = (ch ? ch : null); hm.promotion = pr;
    hm.notation = (fig ? fig : "") + (disc ? disc : "") + (str ? str : "") + col + row + (pr ? pr : "") + (ch ? ch : "");
    return hm; }
  / fig:figure? cols:column rows:row str:strikeOrDash? col:column row:row pr:promotion? ch:check?
    { var hm = {}; hm.fig = (fig ? fig : null); hm.strike = (str =='x' ? str : null); hm.col = col; hm.row = row;
    hm.notation = (fig && (fig!=='P') ? fig : "") + cols + rows + (str=='x' ? str : "-") + col  + row + (pr ? pr : "") + (ch ? ch : "");
    hm.check = (ch ? ch : null); hm.promotion = pr; return hm; }
  / fig:figure? str:strike? col:column row:row pr:promotion? ch:check?
    { var hm = {}; hm.fig = (fig ? fig : null); hm.strike = (str ? str : null); hm.col = col;
    hm.row = row; hm.check = (ch ? ch : null); hm.promotion = pr;
    hm.notation = (fig ? fig : "") + (str ? str : "") + col  + row + (pr ? pr : "") + (ch ? ch : ""); return hm; }
  / 'O-O-O' ch:check? { var hm = {}; hm.notation = 'O-O-O'+ (ch ? ch : ""); hm.check = (ch ? ch : null); return  hm; }
  / 'O-O' ch:check? { var hm = {}; hm.notation = 'O-O'+ (ch ? ch : ""); hm.check = (ch ? ch : null); return  hm; }
  / fig:figure '@' col:column row:row
    { var hm = {}; hm.fig = fig; hm.drop = true; hm.col = col; hm.row = row; hm.notation = fig + '@' + col + row; return hm; }

check
  = ch:(! '+-' '+') { return ch[1]; }
  / ch:(! '$$$' '#') { return ch[1]; }

promotion
  = '='? f:promFigure { return '=' + f; }

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