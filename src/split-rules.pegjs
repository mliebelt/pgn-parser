games = ws games:(
       head:game
         tail:(ws m:game { return m; })*
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
      tail:(ws m:tag { return m; })*
      {
        var result = {};
        [head].concat(tail).forEach(function(element) {
          result[element.name] = element.value;
        });
        return result;
      }
    )? ws
    { return location(); }


tag = bl ws tag:any_no_br ws br { return tag; }

ws "whitespace" = [ \t\n\r]*
wsp = [ \t\n\r]+
eol = [\n\r]+

any_no_br = chars:no_br+ { return chars.join(""); }
any_no_bl = chars:no_bl+ { return chars.join(""); }

no_br = !br char:. { return char; }
no_bl = !bl char:. { return char; }

pgn = pgn:any_no_bl
    { return location(); }

bl = '['

br = ']'