function SolidColorBrush (color)
{
    Brush.apply (this, []);

    this.color = color;
}

SolidColorBrush.prototype = $.extend(new Brush(), {

	visit: function (visitor) {
	    visitor.visitSolidColorBrush (this);
	}
});

DependencyProperties.register (SolidColorBrush, "Color");