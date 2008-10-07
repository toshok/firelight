function Rectangle ()
{
  Shape.apply (this, arguments);
}

Rectangle.prototype = $.extend(new Shape(), {
  toString: function () {
    return "Rectangle";
  },


  measureOverride: function (availableSize) {
    Trace.debug ("in Rectangle.measureOverride");
    var result = Shape.prototype.measureOverride.call (this, availableSize);

    // 	    if (GetStretch () != StretchNone)
    // 		size = size.Min (0,0);

    return result;
  },

  arrangeOverride: function (finalSize) {
    Trace.debug ("in Rectangle.arrangeOverride");
    var result = Shape.prototype.arrangeOverride.call (this, finalSize);

    // 	    if (GetStretch () != StretchNone)
    // 		size = size.Min (0,0);

    return result;
  },

  createPeer: function (host) {
    this.svgPeer = document.createElementNS (FirelightConsts.SVGns, "rect");
    return this.svgPeer;
  }
});

DependencyProperties.register (Rectangle, "RadiusX",
			       { defaultValue: 0.0,
				 affectsRender: true,
				 svgAttribute: "rx" });

DependencyProperties.register (Rectangle, "RadiusY",
			       { defaultValue: 0.0,
				 affectsRender: true,
				 svgAttribute: "ry" });

Types.registerType ("System.Windows.Shapes", Rectangle);
