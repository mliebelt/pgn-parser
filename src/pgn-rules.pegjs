{
    function makeInteger(o) {
        return parseInt(o.join(""), 10);
    }
}

game = t:tags? p:pgn { return { tags: t, moves: p[0] }; }

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


tag = bl tag:tagKeyValue br { return tag; }

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
	/ timeKey ws value:string  { return { name: 'Time', value: value }; }
	/ utcTimeKey ws value:string  { return { name: 'UTCTime', value: value }; }
	/ utcDateKey ws value:string  { return { name: 'UTCDate', value: value }; }
	/ timeControlKey ws value:string  { return { name: 'TimeControl', value: value }; }
	/ setUpKey ws value:string  { return { name: 'SetUp', value: value }; }
	/ fenKey ws value:string  { return { name: 'FEN', value: value }; }
	/ terminationKey ws value:string  { return { name: 'Termination', value: value }; }
	/ anotatorKey ws value:string  { return { name: 'Annotator', value: value }; }
	/ modeKey ws value:string  { return { name: 'Mode', value: value }; }
	/ plyCountKey ws value:integerString  { return { name: 'PlyCount', value: value }; }
	/ any:stringNoQuot ws value:string { return { name: any, value: value }; }

eventKey 				=  'Event' / 'event'
siteKey 				=  'Site' / 'site'
dateKey 				=  'Date' / 'date'
roundKey				=  'Round' / 'round'
whiteKey 				=  'White' / 'White'
blackKey 				=  'Black' / 'black'
resultKey 				=  'Result' / 'result'
whiteTitleKey           =  'WhiteTitle' / 'Whitetitle' / 'whitetitle'
blackTitleKey           =  'BlackTitle' / 'Blacktitle' / 'blacktitle'
whiteEloKey             =  'WhiteELO' / 'WhiteElo' / 'Whiteelo' / 'whiteelo'
blackEloKey             =  'BlackELO' / 'BlackElo' / 'Blackelo' / 'blackelo'
whiteUSCFKey            =  'WhiteUSCF' / 'WhiteUscf' / 'Whiteuscf' / 'whiteuscf'
blackUSCFKey            =  'BlackUSCF' / 'BlackUscf' / 'Blackuscf' / 'blackuscf'
whiteNAKey              =  'WhiteNA' / 'WhiteNa' / 'Whitena' / 'whitena'
blackNAKey              =  'BlackNA' / 'BlackNa' / 'Blackna' / 'blackna'
whiteTypeKey            =  'WhiteType' / 'Whitetype' / 'whitetype'
blackTypeKey            =  'BlackType' / 'Blacktype' / 'blacktype'
eventDateKey            =  'EventDate' / 'Eventdate' / 'eventdate'
eventSponsorKey         =  'EventSponsor' / 'Eventsponsor' / 'eventsponsor'
sectionKey              =  'Section' / 'section'
stageKey                =  'Stage' / 'stage'
boardKey                =  'Board' / 'board'
openingKey              =  'Opening' / 'opening'
variationKey            =  'Variation' / 'variation'
subVariationKey         =  'SubVariation' / 'Subvariation' / 'subvariation'
ecoKey                  =  'ECO' / 'Eco' / 'eco'
nicKey                  =  'NIC' / 'Nic' / 'nic'
timeKey                 =  'Time' / 'time'
utcTimeKey              =  'UTCTime' / 'UTCtime' / 'UtcTime' / 'Utctime' / 'utctime'
utcDateKey              =  'UTCDate' / 'UTCdate' / 'UtcDate' / 'Utcdate' / 'utcdate'
timeControlKey          =  'TimeControl' / 'Timecontrol' / 'timecontrol'
setUpKey                =  'SetUp' / 'Setup' / 'setup'
fenKey                  =  'FEN' / 'Fen' / 'fen'
terminationKey          =  'Termination'  / 'termination'
anotatorKey             =  'Annotator'  / 'annotator'
modeKey                 =  'Mode' / 'mode'
plyCountKey             =  'PlyCount'  / 'Plycount' / 'plycount'

ws "whitespace" = [ \t\n\r]*

string "string"
  = quotation_mark chars:char* quotation_mark { return chars.join(""); }

stringNoQuot
  = chars:[a-zA-Z0-9]* { return chars.join(""); }

quotation_mark
  = '"'

char  = [^\0-\x1F\x22\x5C]

date = quotation_mark year:([0-9] [0-9] [0-9] [0-9]) '.' month:([0-9] [0-9]) '.' day:([0-9] [0-9]) quotation_mark
	{ return "" + year.join("") + '.' + month.join("") + '.' + day.join("");}

result = quotation_mark res:inner_result quotation_mark { return res; }
inner_result =
	res:"1-0" {return res; }
    / res:"1:0" { return res; }
    / res:"0-1" { return res; }
    / res:"0:1" { return res; }
    / res:"1/2-1/2" { return res; }
    / res:"*" { return res; }

integerOrDash =
 	integerString
    / quotation_mark '-' quotation_mark

integerString =
	quotation_mark digits:[0-9]+ quotation_mark { return makeInteger(digits); }

pgn
  = pw:pgnStartWhite all:pgnBlack?
      { var arr = (all ? all : []); arr.unshift(pw);return arr; }
  / pb:pgnStartBlack all:pgnWhite?
    { var arr = (all ? all : []); arr.unshift(pb); return arr; }
  / whiteSpace?
    { return [[]]; }

pgnStartWhite
  = pw:pgnWhite { return pw; }

pgnStartBlack
  = pb:pgnBlack { return pb; }

pgnWhite
  = whiteSpace? cm:comments? whiteSpace? mn:moveNumber? whiteSpace? cb:comments? whiteSpace?
    hm:halfMove  whiteSpace? nag:nags?  whiteSpace? ca:comments? whiteSpace? cd:commentDiag? whiteSpace? vari:variationWhite? all:pgnBlack?
    { var arr = (all ? all : []);
      var move = {}; move.turn = 'w'; move.moveNumber = mn;
      move.notation = hm; move.commentBefore = cb; move.commentAfter = ca; move.commentMove = cm;
      move.variations = (vari ? vari : []); move.nag = (nag ? nag : null); arr.unshift(move); 
      move.commentDiag = cd;
      return arr; }
  / endGame

pgnBlack
  = whiteSpace? cm:comments? whiteSpace? me:moveNumber? whiteSpace? cb:comments? whiteSpace?
    hm:halfMove whiteSpace?  nag:nags? whiteSpace? ca:comments? whiteSpace? cd:commentDiag? whiteSpace? vari:variationBlack? all:pgnWhite?
    { var arr = (all ? all : []);
      var move = {}; move.turn = 'b'; move.moveNumber = me;
      move.notation = hm; move.commentBefore = cb; move.commentAfter = ca; move.commentMove = cm;
      move.variations = (vari ? vari : []); arr.unshift(move); move.nag = (nag ? nag : null);
      move.commentDiag = cd;
      return arr; }
  / endGame

endGame
  = "1:0" whiteSpace? { return ["1:0"]; }
  / "0:1" whiteSpace? { return ["0:1"]; }
  / "1-0" whiteSpace? { return ["1-0"]; }
  / "0-1" whiteSpace? { return ["0-1"]; }
  / "1/2-1/2" whiteSpace?  { return ["1/2-1/2"]; }
  / "*" whiteSpace?  { return ["*"]; }

comments
  = cf:comment cfl:(whiteSpace? comment)*
  { var comm = cf; for (var i=0; i < cfl.length; i++) { comm += " " + cfl[i][1]}; return comm; }

comment
  = ! commentDiag cl cm:[^}]+ cr { return cm.join("").trim(); }

commentDiag
  = cl whiteSpace? cas:commentAnnotations whiteSpace? cr { return cas; }

commentAnnotations
  = ca:commentAnnotation whiteSpace? cal:(commentAnnotation)*
  { var ret = { }; if (cal) { var o = cal[0]; return {...ca, ...o}; } return ca; }

commentAnnotation
  = caf:commentAnnotationFields { var ret = {}; ret.colorFields = caf; return ret; }
  / caa:commentAnnotationArrows { var ret = {}; ret.colorArrows = caa; return ret; }
  / cac:commentAnnotationClock { var ret = {}; ret.clock = cac; return ret; }

commentAnnotationFields
  = bl whiteSpace? "%csl" whiteSpace cfs:colorFields whiteSpace? br { return cfs; }

commentAnnotationArrows
  = bl whiteSpace? "%cal" whiteSpace cfs:colorArrows whiteSpace? br { return cfs; }

colorFields
  = cf:colorField whiteSpace? cfl:("," whiteSpace? colorField)*
  { var arr = []; arr.push(cf); for (var i=0; i < cfl.length; i++) { arr.push(cfl[i][2])}; return arr; }

colorField
  = col:color f:field { return col + f; }

colorArrows
  = cf:colorArrow whiteSpace? cfl:("," whiteSpace? colorArrow)*
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

commentAnnotationClock
  = bl whiteSpace? "%" cc:clockCommand whiteSpace cv:clockValue whiteSpace? br
  { var ret = {}; ret.type = cc; ret.value = cv; return ret; }

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
  = pl vari:pgnWhite pr whiteSpace? all:variationWhite? whiteSpace? me:moveNumber?
    { var arr = (all ? all : []); arr.unshift(vari); return arr; }

variationBlack
  = pl vari:pgnStartBlack pr whiteSpace? all:variationBlack?
    { var arr = (all ? all : []); arr.unshift(vari); return arr; }

pl = '('

pr = ')'

moveNumber
    = num:integer dotOrWhitespace* { return num; }

dot = "."

integer "integer"
    = digits:[0-9]+ { return makeInteger(digits); }

whiteSpace
    = " "+ { return '';}

dotOrWhitespace
    = dot
    / whiteSpace

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

check
  = ch:(! '+-' '+') { return ch[1]; }
  / ch:(! '$$$' '#') { return ch[1]; }

promotion
  = '=' f:promFigure { return '=' + f; }

nags
  = nag:nag whiteSpace? nags:nags? { var arr = (nags ? nags : []); arr.unshift(nag); return arr; }

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