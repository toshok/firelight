function SolidColorBrush (color)
{
    Brush.apply (this, []);

    if (typeof (color) != "undefined")
	this.color = color;
}

SolidColorBrush.prototype = $.extend(new Brush(), {
    computePropertyValue: function () {
	return this.color;
    }
});

DependencyProperties.register (SolidColorBrush, "Color",
			       { defaultValue: "rgba(0,0,0,1.0)" });

Types.registerType ("System.Windows.Media", SolidColorBrush);
