function Shape ()
{
}

Shape.prototype = $.extend(new FrameworkElement(), {
    toString: function () {
	return "Shape";
    }
});

DependencyProperties.register (Shape, "Fill",
			       { propertyType: Brush }); // affectsMeasure?
DependencyProperties.register (Shape, "Stroke",
			       { propertyType: Brush }); // affectsMeasure?

Types.registerType ("System.Windows.Shapes", Shape);
