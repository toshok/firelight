var Timespan = {
  fromSeconds: function (s) {
    return s * 10000000.0;
  },

  toSeconds: function (ts) {
    return ts /  10000000.0;
  },

  parse: function (s) {
    var re = /(?:(\d+)(?:\:(\d+)(?:\:(\d+)(?:(\.\d+))?)?)?)/;

    var match = re.exec(s);
    if (!match)
      throw new Error ("Timespan.parse failed for input '" + s + "'.");

    if (match.length > 5)
      throw new Error ("Timespan.parse internal failure parsing input '" + s + "', length = " + match.length);

    var hours = match[1];
    var minutes = match.length > 2 ? match[2] : 0;
    var seconds = match.length > 3 ? match[3] : 0;
    var fraction = match.length > 4 ? match[4] : 0;

    return Timespan.fromSeconds (Number(fraction) +
				 Number(seconds) +
				 Number(minutes) * 60 +
				 Number(hours) * 60 * 60);
  }
};