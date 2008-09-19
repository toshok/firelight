function LinearGradientBrush ()
{
    GradientBrush.apply (this, []);
}

LinearGradientBrush.prototype = $.extend(new GradientBrush(), {
    svgGradientElement: "linearGradient",

    toString: function () {
	return "LinearGradientBrush";
    },

    computePropertyValue: function () {

	this.gradientDef.setAttributeNS (null, "x1", this.startPoint.x);
	this.gradientDef.setAttributeNS (null, "y1", this.startPoint.y);
	this.gradientDef.setAttributeNS (null, "x2", this.endPoint.x);
	this.gradientDef.setAttributeNS (null, "y2", this.endPoint.y);

	return GradientBrush.prototype.computePropertyValue.apply (this, arguments);
    }

});

DependencyProperties.register (LinearGradientBrush, "StartPoint",
                               { defaultValue: function () { return { x: 0, y: 0 }; },
				 propertyType: Point,
				 coerceValue: coerceValueToPoint });
DependencyProperties.register (LinearGradientBrush, "EndPoint",
                               { defaultValue: function () { return { x: 1, y: 0 }; },
				 propertyType: Point,
				 coerceValue: coerceValueToPoint });

Types.registerType ("System.Windows.Media", LinearGradientBrush);
