RegisterType ("System.Windows.Media", "ScaleTransform",
	      Transform, null,
{
  computePropertyValue: function () {
    return "scale(" + this.scaleX + "," + this.scaleY + ")";
  }
});

DependencyProperties.register (ScaleTransform, "ScaleX",
			       { defaultValue: 1 });
DependencyProperties.register (ScaleTransform, "ScaleY",
			       { defaultValue: 1 });
