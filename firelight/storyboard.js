function Storyboard ()
{
  TimelineGroup.apply (this, arguments);

  this.running = false;
}

Storyboard.prototype = $.extend(new TimelineGroup(), {
  start: function () {
    this.resolve ();
    this.host.addTimeline (this);
    console.log ("added timeline to host");
  },

  stop: function () {
    this.host.removeTimeline (this);
    this.resetState();
  },

  updateFromParentTime: function (parentTime) {
    TimelineGroup.prototype.updateFromParentTime.apply (this, arguments);
    if (this.completed) {
      console.log ("stopping storyboard");
      this.stop ();
    }
  },

  toString: function () {
    return "Storyboard";
  }
});

DependencyProperties.registerAttached (Storyboard, "TargetName",
				       { propertyType: String });
DependencyProperties.registerAttached (Storyboard, "TargetProperty",
				       { propertyType: String });

Types.registerType ("System.Windows.Media.Animation", Storyboard);
