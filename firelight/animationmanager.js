function AnimationManager () {
  var timelines = [];

  this.addTimeline = function (tl) {
    timelines.push (tl);
  };

  this.removeTimeline = function (tl) {
    var removed = false;
    for (var i = 0; i < timelines.length; i ++) {
      if (timelines[i] == tl) {
	timelines.remove (i);
	removed = true;
	break;
      }
    }

    if (!removed)
      throw new Error ("timeline was not registered with the SVG host");
  };

  this.needClock = function (tl) {
    return timelines.length > 0;
  };

  this.processAnimations = function () {
  };
}