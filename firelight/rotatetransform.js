RegisterType ("System.Windows.Media", "RotateTransform",
	      Transform, null,
{
  computePropertyValue: function () {
    return "rotate(" + this.angle + "," + this.centerX + "," + this.centerY + ")";
  }
});

DependencyProperties.register (RotateTransform, "Angle",
			       { defaultValue: 0 });
DependencyProperties.register (RotateTransform, "CenterX",
			       { defaultValue: 0 });
DependencyProperties.register (RotateTransform, "CenterY",
			       { defaultValue: 0 });

