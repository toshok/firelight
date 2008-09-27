function Transform ()
{
  DependencyObject.apply (this, arguments);
}
Transform.prototype = $.extend(new DependencyObject(), {
  toString: function () {
    return "Transform";
  }
});

DependencyProperties.register (Transform, "SvgPropertyValue",
			       { defaultValue: "",
				 alwaysNotify: true });

Types.registerType ("System.Windows.Media", Transform);

//Types.registerType ("System.Windows.Media", TranslateTransform);
//Types.registerType ("System.Windows.Media", SkewTransform);
//Types.registerType ("System.Windows.Media", MatrixTransform);
