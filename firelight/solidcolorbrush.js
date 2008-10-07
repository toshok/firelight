function SolidColorBrush ()
{
  Brush.apply (this, arguments);
}

SolidColorBrush.prototype = $.extend(new Brush(), {
  computePropertyValue: function () {
    this.svgPropertyValue = this.color;
  }
});

DependencyProperties.register (SolidColorBrush, "Color",
			       { defaultValue: "rgba(0,0,0,1.0)" });

Types.registerType ("System.Windows.Media", SolidColorBrush);
