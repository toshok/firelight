function GradientStop ()
{
    DependencyObject.apply (this, arguments);
}

GradientStop.prototype = $.extend(new DependencyObject(), {
    toString: function () {
	    return "GradientStop";
    },
});

DependencyProperties.register (GradientStop, "Color",
			       { defaultValue: "rgba(0,0,0,0.0)" });

DependencyProperties.register (GradientStop, "Offset",
			       { defaultValue: "0%" });
