RegisterType ("System.Windows.Media", "SkewTransform",
	      Transform, null,
{
  computePropertyValue: function () {
    var val = "";
    if (this.x)
      val += "skewX (" + this.x + ")";
    if (this.y)
      val += "skewY (" + this.y + ")";
    return val;
  }
});

DependencyProperties.register (SkewTransform, "X",
			       { defaultValue: 0 });
DependencyProperties.register (SkewTransform, "Y",
			       { defaultValue: 0 });
