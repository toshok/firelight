function Duration (ts) {
  this.timeSpan = ts;
  this.kind = "timespan";
}

Duration.prototype = {
  toString: function () {
    return "Duration " + this.kind + " (" + this.timeSpan + ")";
  },

  equals: function (d) {
    return this.kind == d.kind && this.timeSpan == d.timeSpan;
  },

  max: function (d) {
    if (this.kind == "forever")
      return this;
    else if (this.kind == "automatic")
      return d;
    else if (this.kind == "timespan") {
      if (d.kind == "timespan")
	return d.timeSpan > this.timeSpan ? d : this;
      else if (d.kind == "forever")
	return d;
      else if (d.kind == "automatic")
	return this;
    }

    throw new Error ("shouldn't be reached, this.kind = " + this.kind + ", d.kind = " + d.kind);
  }
};

Duration.automatic = function () {
  var d = new Duration (-1);
  d.kind = "automatic";
  return d;
} ();

Duration.forever = function () {
  var d = new Duration (-1);
  d.kind = "forever";
  return d;
} ();

Duration.parse = function (s) {
  return new Duration (Timespan.parse(s));
};

Duration.fromTimeSpan = function (ts) {
  return new Duration (ts);
};

Duration.fromSeconds = function (s) {
  return new Duration (Timespan.fromSeconds (s));
};
