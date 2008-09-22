function LayoutManager () {
  var priority_levels = [];

  function ensurePriorityLevels (c) {
    console.log ("ensurePriorityLevels(" + c + ")");

    if (c < priority_levels.length) {
      console.log ("we're already big enough");
      return;
    }

    var old_length = priority_levels.length;
    priority_levels = priority_levels.concat (new Array (c - old_length + 1));
    for (var i = old_length; i < priority_levels.length; i ++)
      priority_levels[i] = [];
  }

  function findElement (fwe) {
    console.log ("findElement");
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
    console.log ("layout manager needs clock?");
    for (var i = 0; i < priority_levels.length; i ++) {
      console.log ("priority_level[" + i + "] = " + priority_levels[i]);
      if (priority_levels[i].length > 0)
	return true;
    }

    console.log ("returning false");
    return false;
  };

  this.processPendingMeasureAndArrange = function () {
    console.log ("processPendingMeasureAndArrange");
    for (var i = 0; i < priority_levels.length; i ++) {
      console.log ("handling level " + i);
      while (priority_levels[i].length) {
	var l = priority_levels[i][0];

	console.log ("l.element = " + l.element);
	var slot = l.element.getValue(LayoutInformation.prototype.LayoutSlotProperty);

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