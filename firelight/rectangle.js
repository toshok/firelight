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

  updateFill: function () {
    this.svgPeer.setAttributeNS (null, "fill",
				 this.fill.svgPropertyValue);
  },

  updateStroke: function () {
    this.svgPeer.setAttributeNS (null, "stroke",
				 this.stroke.svgPropertyValue);
  },

  createPeer: function (host) {
    var peer = document.createElementNS (FirelightConsts.SVGns, "rect");

    var that = this;

    if (this.fill)
      this.fill.applyToPeer (this.host, function (v) { that.updateFill (); });

    if (this.stroke)
      this.stroke.applyToPeer (this.host, function (v) { that.updateStroke (); });

    // XXX these need an automatic binding
    peer.setAttributeNS (null, "x", String(this.renderPosition.x));
    peer.setAttributeNS (null, "y", String(this.renderPosition.y));
    peer.setAttributeNS (null, "width", String(this.renderSize.width));
    peer.setAttributeNS (null, "height", String(this.renderSize.height));
    peer.setAttributeNS (null, "rx", String(this.radiusX));
    peer.setAttributeNS (null, "ry", String(this.radiusY));

    this.svgPeer = peer;
    return peer;
  }
});

DependencyProperties.register (Rectangle, "RadiusX",
			       { defaultValue: 0.0,
				 affectsRender: true });
DependencyProperties.register (Rectangle, "RadiusY",
			       { defaultValue: 0.0,
				 affectsRender: true });

Types.registerType ("System.Windows.Shapes", Rectangle);
