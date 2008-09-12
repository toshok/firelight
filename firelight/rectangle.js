function Rectangle ()
{
}

Rectangle.prototype = $.extend(new Shape(), {

    measureOverride: function (availableSize) {
	    var result = this.prototype.measureOverride (availableSize);

// 	    if (GetStretch () != StretchNone)
// 		size = size.Min (0,0);
	    
	    return result;
    },

    arrangeOverride: function (finalSize) {
	    var result = this.prototype.arrangeOverride (finalSize);

// 	    if (GetStretch () != StretchNone)
// 		size = size.Min (0,0);
	    
	    return result;
    },

    toString: function () {
	    return "Rectangle";
    },
});

DependencyProperties.register (Rectangle, "RadiusX",
			       { defaultValue: 0.0,
				 affectsRender: true });
DependencyProperties.register (Rectangle, "RadiusY",
			       { defaultValue: 0.0,
				 affectsRender: true });
