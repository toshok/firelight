function Duration (ts) {
}

Duration.prototype = {
  toString: function () {
  }
};

Duration.parse = function (s) {
  return new Duration (Timespan.parse(s));
};

Duration.fromTimeSpan = function (ts) {
  return new Duration (ts);
};

Duration.fromSeconds = function (s) {
  return new Duration (Timespan.fromSeconds (s));
};