games = ws games:(
       head:game
         tail:(eol eol+ m:game { return m; })*
         {
            //console.log("Length tail: " + tail.length);
            return [head].concat(tail) }
       )? {
            //console.log("Length: " + games.length);
            return games; }

game = t:tags? p:pgn
    {
      return { tags: t, pgn: p }; }

tags = ws members:(
      head:tag
      tail:(ws m:tag)*
    )? ws
    { return location(); }


tag = bl ws tag:any_no_br ws br

ws "whitespace" = [ \t\n\r]*
wsp = [ \t\n\r]+
eol = [\n\r]+
eol2 = eol eol
no_eol2 = !eol2 c:. { return c }
no_eol = !eol .

pgn = pgn_line (eol pgn)* { return location();  }
pgn_line = [^\n\r]+

any_no_br = chars:no_br+

no_br = !br char:.

bl = '['

br = ']'