function Rectangle ()
{
}

Rectangle.prototype = $.extend(new Shape(), {
  toString: function () {
      return "Rectangle";
  },


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

  createPeer: function (host) {
	var peer = document.createElementNS (FirelightConsts.SVGns, "rect");

	if (this.fill)
	    this.fill.applyToPeer (host, peer, "fill");

	if (this.stroke)
	    this.stroke.applyToPeer (host, peer, "stroke");

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
