function GradientBrush ()
{
    Brush.apply (this, []);
}

GradientBrush.prototype = $.extend(new Brush(), {
	contentProperty: "GradientStops"
});

DependencyProperties.register (GradientBrush, "GradientStops",
			       { defaultValue: function () { return new GradientStopCollection (); },
				 readOnly: true } );

Types.registerType ("System.Windows.Media", GradientBrush);
