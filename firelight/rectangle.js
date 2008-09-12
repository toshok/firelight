function Rectangle ()
{
}

Rectangle.prototype = $.extend(new Shape(), {

    measureOverride: function (availableSize) {
	    console.log ("in Rectangle.measureOverride");
	    var result = this.__proto__.__proto__.measureOverride (availableSize);

// 	    if (GetStretch () != StretchNone)
// 		size = size.Min (0,0);
	    
	    return result;
    },

    arrangeOverride: function (finalSize) {
	    console.log ("in Rectangle.arrangeOverride");
	    var result = this.__proto__.__proto__.arrangeOverride (finalSize);

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
