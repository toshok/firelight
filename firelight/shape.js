function Shape ()
{
  FrameworkElement.apply (this, arguments);
}

Shape.prototype = $.extend(new FrameworkElement(), {
    toString: function () {
	return "Shape";
    }
});

DependencyProperties.register (Shape, "Fill",
			       { propertyType: Brush,
				 svgAttribute: "fill" }); // affectsMeasure?
DependencyProperties.register (Shape, "Stroke",
			       { propertyType: Brush,
				 svgAttribute: "stroke" }); // affectsMeasure?

Types.registerType ("System.Windows.Shapes", Shape);
