RegisterType ("System.Windows.Media.Animation", "TimelineGroup",
	      Timeline, null,
{
  contentProperty: "Children",

  calculateDuration: function () {
    var i;

    if (this.duration.equals (Duration.automatic)) {
      var duration = this.duration;
      for (i = 0; i < this.children.count; i ++) {
	duration = duration.max (this.children.getItemAt(i).calculateDuration());
      }
      if (duration.equals (Duration.automatic))
	this.computedDuration = Duration.fromSeconds(1);
      else
	this.computedDuration = duration;
    }
    else {
      this.computedDuration = this.duration;

      for (i = 0; i < this.children.count; i ++) {
	var child = this.children.getItemAt(i);
	if (child.duration.equals (Duration.automatic)) {
	  child.computedDuration = new Duration (this.computedDuration.timeSpan - child.beginTime.timeSpan);
	}
      }
    }

    return this.computedDuration;
  },

  updateFromParentTime: function (parentTime) {
    Timeline.prototype.updateFromParentTime.apply (this, arguments);

    var children = this.children;
    for (var i = 0; i < children.count; i ++) {
      children.getItemAt(i).updateFromParentTime (this.localTime);
    }
  },

  resolve: function () {
    Timeline.prototype.resolve.apply (this, arguments);

    for (var i = 0; i < this.children.count; i ++) {
      var child = this.children.getItemAt(i);
      child.resolve ();
    }
  },

  resetState: function () {
    Timeline.prototype.resetState.apply (this, arguments);

    for (var i = 0; i < this.children.count; i ++) {
      var child = this.children.getItemAt(i);
      child.resetState ();
    }
  }
});

DependencyProperties.register (TimelineGroup, "Children",
			       { propertyType: TimelineCollection,
				 defaultValue: function () { return new TimelineCollection (); }
			       });
