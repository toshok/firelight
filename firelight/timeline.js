function Timeline ()
{
  DependencyObject.apply (this, arguments);
}

Timeline.prototype = $.extend(new DependencyObject(), {
});

DependencyProperties.register (Timeline, "AutoReverse",
			       { propertyType: Boolean });

DependencyProperties.register (Timeline, "BeginTime",
			       { propertyType: Number/*XXX Duration*/ });

DependencyProperties.register (Timeline, "Duration",
			       { defaultValue: function () { return Duration.fromSeconds (1); },
				 propertyType: Duration,
				 coerceValue: coerceValueToDuration });

DependencyProperties.register (Timeline, "FillBehavior",
			       { propertyType: String,
				 coerceValue: coerceValueToFillBehavior });

DependencyProperties.register (Timeline, "RepeatBehavior",
			       { propertyType: String,
				 /*XXX validateValue: validateRepeatBehavior*/ });

DependencyProperties.register (Timeline, "SpeedRatio",
			       { propertyType: Number });

Types.registerType ("System.Windows.Media.Animation", Timeline);
