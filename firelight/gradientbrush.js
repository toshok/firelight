RegisterType ("System.Windows.Media", "GradientBrush",
	      Brush, null,
{
  contentProperty: "GradientStops",

  computePropertyValue: function () {
    if (!this.gradientId) {
      this.gradientId = getDefId ();

      this.gradientDef = document.createElementNS (FirelightConsts.SVGns, this.svgGradientElement);
      this.gradientDef.setAttributeNS (null, "id", this.gradientId);

      var that = this;
      this.gradientStops.addCollectionChangeHandler (function (args) {
						       that.computePropertyValue();
						     });

      this.host.defs.appendChild (this.gradientDef);
    }

    // first clear out the gradientStops
    while (this.gradientDef.firstChild)
      this.gradientDef.removeChild(this.gradientDef.firstChild);

    // then regenerate them
    for (var i = 0; i < this.gradientStops.count; i ++) {
      var stop = this.gradientStops.getItemAt(i);
      var peer = document.createElementNS (FirelightConsts.SVGns, "stop");
      //Trace.debug ("creating <stop offset="+ stop.offset + " color=" + stop.color + " />");
      peer.setAttributeNS (null, "offset", stop.offset);
      peer.setAttributeNS (null, "stop-color", stop.color);
      this.gradientDef.appendChild (peer);
    }

    Trace.debug ("setting svgPropertyValue to '" + "url(#" + this.gradientId + ")'");
    this.svgPropertyValue = "url(#" + this.gradientId + ")";
  }
});

DependencyProperties.register (GradientBrush, "GradientStops",
			       { defaultValue: function () { return new GradientStopCollection (); },
				 readOnly: true } );
