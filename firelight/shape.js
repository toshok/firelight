RegisterType ("System.Windows.Shapes", "Shape",
	      FrameworkElement, null,
{
});

DependencyProperties.register (Shape, "Fill",
			       { propertyType: Brush,
				 svgAttribute: "fill" }); // affectsMeasure?
DependencyProperties.register (Shape, "Stroke",
			       { propertyType: Brush,
				 svgAttribute: "stroke" }); // affectsMeasure?
