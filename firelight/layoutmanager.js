function LayoutManager () {
  var priority_levels = [];

  function ensurePriorityLevels (c) {
//    Trace.debug ("ensurePriorityLevels(" + c + ")");

    if (c < priority_levels.length) {
//      Trace.debug ("we're already big enough");
      return;
    }

    var old_length = priority_levels.length;
    priority_levels = priority_levels.concat (new Array (c - old_length + 1));
    for (var i = old_length; i < priority_levels.length; i ++)
      priority_levels[i] = [];
  }

  function findElement (fwe) {
//    Trace.debug ("findElement");
    var level = priority_levels[fwe.visualLevel];
    for (var i = 0; i < level.length; i ++)
      if (level[i].element == fwe)
	return level[i];
    return null;
  }

  this.addMeasure = function (fwe) {
    ensurePriorityLevels (fwe.visualLevel);

    var existing = findElement (fwe);
    if (existing) {
      existing.measure = true;
      existing.arrange = true;
    }
    else {
      priority_levels[fwe.visualLevel].push ({element: fwe, measure: true, arrange: true});
    }
  };

  this.addArrange = function (fwe) {
    ensurePriorityLevels (fwe.visualLevel);

    var existing = findElement (fwe);
    if (existing) {
      existing.arrange = true;
    }
    else {
      priority_levels[fwe.visualLevel].push ({element: fwe, arrange: true});
    }
  };

  this.needClock = function (tl) {
//    Trace.debug ("layout manager needs clock?");
    for (var i = 0; i < priority_levels.length; i ++) {
//      Trace.debug ("priority_level[" + i + "] = " + priority_levels[i]);
      if (priority_levels[i].length > 0)
	return true;
    }

//    Trace.debug ("returning false");
    return false;
  };

  this.processPendingMeasureAndArrange = function () {
//    Trace.debug ("processPendingMeasureAndArrange");
    for (var i = 0; i < priority_levels.length; i ++) {
//      Trace.debug ("handling level " + i);
      while (priority_levels[i].length) {
	var l = priority_levels[i][0];

//	Trace.debug ("l.element = " + l.element);
	var slot = l.element.getValue(LayoutInformation.LayoutSlotProperty);

	if (!slot)
	  throw new Error ("can't layout out an element that doesn't have a LayoutSlot property");

	if (l.measure)
	  l.element.measure (new Size (slot.width, slot.height));

	if (l.arrange)
	  l.element.arrange (slot);

	priority_levels[i].shift();
      }
    }
  };
}

