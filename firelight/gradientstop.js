RegisterType ("System.Windows.Media", "GradientStop",
	      DependencyObject, null,
{
});

DependencyProperties.register (GradientStop, "Color",
			       { defaultValue: "rgba(0,0,0,0.0)" });

DependencyProperties.register (GradientStop, "Offset",
			       { defaultValue: "0%" });
