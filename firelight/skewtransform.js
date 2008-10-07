function SkewTransform ()
{
  Transform.apply (this, arguments);
}
SkewTransform.prototype = $.extend(new Transform(), {
  toString: function () {
    return "SkewTransform";
  },

  computePropertyValue: function () {
    var val = "";
    if (this.x)
      val += "skewX (" + this.x + ")";
    if (this.y)
      val += "skewY (" + this.y + ")";
    return val;
  }
});
Types.registerType ("System.Windows.Media", SkewTransform);

DependencyProperties.register (SkewTransform, "X",
			       { defaultValue: 0 });
DependencyProperties.register (SkewTransform, "Y",
			       { defaultValue: 0 });
