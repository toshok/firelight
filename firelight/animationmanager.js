function AnimationManager () {
  var timelines = [];
  var created = (new Date()).getTime();

  this.addTimeline = function (tl) {
    timelines.push (tl);

    tl.calculateDuration ();
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
    var currentGlobalTime = (new Date()).getTime();

    var removeAfterUpdate = [];

    var i;
    for (i = 0; i < timelines.length; i ++) {
      var beginTime = timelines[i].beginTime.timeSpan;
      var duration = timelines[i].computedDuration.timeSpan;

      var timeToSend = Timespan.fromMilliseconds (currentGlobalTime);

      var removeTimelineAfterUpdate = false;
      if (timelines[i].started + duration < timeToSend) {
	timeToSend = timelines[i].started + duration;
      }

//      try {
	timelines[i].updateFromParentTime(timeToSend);
//      }
//      catch (ex) {
//	console.log ("Error updating timeline:\n" + ex);
//	removeTimelineAfterUpdate = true;
//      }
      if (removeTimelineAfterUpdate)
	removeAfterUpdate.push (i);
    }

    for (i = removeAfterUpdate.length - 1; i >= 0; i ++)
      timelines.remove (removeAfterUpdate[i]);
  };
}
