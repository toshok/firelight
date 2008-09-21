function GradientBrush ()
{
    Brush.apply (this, []);
}

GradientBrush.prototype = $.extend(new Brush(), {
    contentProperty: "GradientStops",

    applyToPeer: function (host, peer, property) {
	this.gradientId = getDefId ();

	this.gradientDef = document.createElementNS (FirelightConsts.SVGns, this.svgGradientElement);
	this.gradientDef.setAttributeNS (null, "id", this.gradientId);

	var that = this;
	this.gradientStops.addCollectionChangeHandler (function (args) {
	    that.appliedToPeer.setAttributeNS (null, property, that.computePropertyValue());
	});

	host.defs.appendChild (this.gradientDef);

	console.log ("calling dependencyobject.applyToPeer");
	DependencyObject.prototype.applyToPeer.apply (this, arguments);
    },

    computePropertyValue: function () {
	// first clear out the gradientStops
	while (this.gradientDef.firstChild)
	    this.gradientDef.removeChild(this.gradientDef.firstChild);

	// then regenerate them
	for (var i = 0; i < this.gradientStops.count; i ++) {
	    var stop = this.gradientStops.getItemAt(i);
	    var peer = document.createElementNS (FirelightConsts.SVGns, "stop");
	    //console.log ("creating <stop offset="+ stop.offset + " color=" + stop.color + " />");
	    peer.setAttributeNS (null, "offset", stop.offset);
	    peer.setAttributeNS (null, "stop-color", stop.color);
	    this.gradientDef.appendChild (peer);
	}

	return "url(#" + this.gradientId + ")";
    }

});

DependencyProperties.register (GradientBrush, "GradientStops",
			       { defaultValue: function () { return new GradientStopCollection (); },
				 readOnly: true } );

Types.registerType ("System.Windows.Media", GradientBrush);
