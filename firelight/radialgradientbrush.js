RegisterType ("System.Windows.Media", "RadialGradientBrush",
	      GradientBrush, null,
{
  svgGradientElement: "radialGradient",

  computePropertyValue: function () {
    GradientBrush.prototype.computePropertyValue.apply (this, arguments);

    // XXX this is absolutely ALL WRONG
    this.gradientDef.setAttributeNS (null, "cx", this.center.x);
    this.gradientDef.setAttributeNS (null, "cy", this.center.y);
    this.gradientDef.setAttributeNS (null, "r", this.radiusX);
    var scaleX = this.radiusX;
    var scaleY = this.radiusY;
    if (scaleX > scaleY) {
      scaleY /= scaleX;
      scaleX = 1;
    }
    else {
      scaleX /= scaleY;
      scaleY = 1;
    }
    this.gradientDef.setAttributeNS (null, "gradientTransform", "scale(" + scaleX + "," + scaleY + ")");
  }

});

DependencyProperties.register (RadialGradientBrush, "Center",
                               { defaultValue: function () { return { x: 0.5, y: 0.5 }; },
				 propertyType: Point,
				 coerceValue: coerceValueToPoint });
DependencyProperties.register (RadialGradientBrush, "GradientOrigin",
                               { defaultValue: function () { return { x: 0.5, y: 0.5 }; },
				 propertyType: Point,
				 coerceValue: coerceValueToPoint });
DependencyProperties.register (RadialGradientBrush, "RadiusX",
                               { defaultValue: 0.5 });
DependencyProperties.register (RadialGradientBrush, "RadiusY",
                               { defaultValue: 0.5 });
