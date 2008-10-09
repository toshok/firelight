RegisterType ("System.Windows.Media", "SolidColorBrush",
	      Brush, null,
{
  computePropertyValue: function () {
    this.svgPropertyValue = this.color;
  }
});

DependencyProperties.register (SolidColorBrush, "Color",
			       { defaultValue: "rgba(0,0,0,1.0)" });
