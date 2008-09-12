function LinearGradientBrush ()
{
    GradientBrush.apply (this, []);
}

LinearGradientBrush.prototype = $.extend(new GradientBrush(), {

	visit: function (visitor) {
	    visitor.visitLinearGradientBrush (this);
	}

});

DependencyProperties.register (LinearGradientBrush, "StartPoint");
DependencyProperties.register (LinearGradientBrush, "EndPoint");

Types.registerType ("System.Windows.Media", LinearGradientBrush);
