function Shape ()
{
}

Shape.prototype = $.extend(new FrameworkElement(), {
    toString: function () {
	    return "Shape";
    },
});

DependencyProperties.register (Shape, "Fill"); // affectsMeasure?
DependencyProperties.register (Shape, "Stroke"); // affectsMeasure?
