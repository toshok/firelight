function RepeatBehavior () {
};

RepeatBehavior.prototype = {
  setCount: function (c) {
    this.hasCount = true;
    this.count = c;
  },

  setDuration: function (d) {
    this.hasCount = false;
    this.duration = d;
  },

  getCount: function () {
    if (!this.hasCount)
      throw new Error ("Invalid call to RepeatBehavior.getCount when it represents a duration.");
    return this.count;
  },

  getDuration: function () {
    if (this.hasCount)
      throw new Error ("Invalid call to RepeatBehavior.getDuration when it represents a count.");
    return this.duration;
  },

  hasCount: function () {
    return this.hasCount;
  },

  hasDuration: function () {
    return !this.hasCount;
  }
};

RepeatBehavior.fromCount = function (c) {
  var r = new RepeatBehavior ();
  r.setCount (c);
  return r;
}

RepeatBehavior.fromDuration = function (d) {
  var r = new RepeatBehavior ();
  r.setDuration (d);
  return r;
};

RepeatBehavior.forever = RepeatBehavior.fromDuration(NaN);

