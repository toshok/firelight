RegisterType ("System.Windows.Media", "LinearGradientBrush",
	      GradientBrush, null,
{
  svgGradientElement: "linearGradient",

  computePropertyValue: function () {
    GradientBrush.prototype.computePropertyValue.apply (this, arguments);

    this.gradientDef.setAttributeNS (null, "x1", this.startPoint.x);
    this.gradientDef.setAttributeNS (null, "y1", this.startPoint.y);
    this.gradientDef.setAttributeNS (null, "x2", this.endPoint.x);
    this.gradientDef.setAttributeNS (null, "y2", this.endPoint.y);
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
