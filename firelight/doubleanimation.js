function DoubleAnimation ()
{
  Timeline.apply (this, arguments);
}

DoubleAnimation.prototype = $.extend(new Timeline(), {
  toString: function () {
    return "DoubleAnimation";
  }
});

DependencyProperties.register (DoubleAnimation, "By",
			       { propertyType: Number });
DependencyProperties.register (DoubleAnimation, "From",
			       { propertyType: Number });
DependencyProperties.register (DoubleAnimation, "To",
			       { propertyType: Number });

Types.registerType ("System.Windows.Media.Animation", DoubleAnimation);
