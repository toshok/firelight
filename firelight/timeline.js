RegisterType ("System.Windows.Media.Animation", "Timeline",
	      DependencyObject, null,
{
  calculateDuration: function () {
    console.log ("in Timeline.calculateDuration");
    if (this.duration.equals (Duration.automatic))
      this.computedDuration = Duration.fromSeconds(1);
    else
      this.computedDuration = this.duration;
    return this.computedDuration;
  },

  updateFromParentTime: function (parentTime) {
    if (!("localTime" in this)) {
      /* we're starting at parentTime, record that */
      this.started = parentTime;
    }

    // update our idea of our localTime (stored in localTime) based on
    // our parent's time.
    var local = parentTime - this.started;

//    console.log ("local = " + Timespan.toSeconds (local) + ", duration = " + this.computedDuration);

    if (local < this.beginTime.timeSpan)
      this.localTime = 0;
    else if (local >= this.computedDuration.timeSpan) {
      this.localTime = this.computedDuration.timeSpan;
      this.completed = true;
    }
    else
      this.localTime = local;

    // XXX more stuff here
  },

  resolve: function () {
  },

  resetState: function () {
    delete this.started;
    delete this.localTime;
    delete this.computedDuration;
    delete this.completed;
  }
});

DependencyProperties.register (Timeline, "AutoReverse",
			       { propertyType: Boolean });

DependencyProperties.register (Timeline, "BeginTime",
			       { defaultValue: function () { return Duration.fromSeconds (0); },
				 propertyType: Duration,
				 coerceValue: coerceValueToDuration });

DependencyProperties.register (Timeline, "Duration",
			       { defaultValue: function () { return Duration.automatic; },
				 propertyType: Duration,
				 coerceValue: coerceValueToDuration });

DependencyProperties.register (Timeline, "FillBehavior",
			       { propertyType: String,
				 coerceValue: coerceValueToFillBehavior });

DependencyProperties.register (Timeline, "RepeatBehavior",
			       { propertyType: String
				 /*XXX validateValue: validateRepeatBehavior*/ });

DependencyProperties.register (Timeline, "SpeedRatio",
			       { propertyType: Number });
