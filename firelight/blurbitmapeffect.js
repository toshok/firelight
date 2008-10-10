RegisterType ("System.Windows.Media.Effects", "BlurBitmapEffect",
	      BitmapEffect, null,
{
  computePropertyValue: function () {
    if (!this.filterId) {
      this.filterId = getDefId ();


      // this isn't full featured yet -- it lacks support for
      // kernelType, it always uses gaussian
      //
      // we want something that looks like:
      //
      // <filter id="$FILTERID">
      //   <feGaussianBlur in="SourceGraphic" stdDeviation="$RADIUS" result="blur"/>
      // </filter>

      this.filterDef = document.createElementNS (FirelightConsts.SVGns, "filter");
      this.filterDef.setAttributeNS (null, "id", this.filterId);
      this.filterDef.setAttributeNS (null, "filterUnits", "userSpaceOnUse");

      this.gaussian = document.createElementNS (FirelightConsts.SVGns, "feGaussianBlur");
      this.gaussian.setAttributeNS (null, "in", "SourceGraphic");
      this.gaussian.setAttributeNS (null, "stdDeviation", this.radius.toString());
      this.gaussian.setAttributeNS (null, "result", "blur");
      this.filterDef.appendChild (this.gaussian);

      this.host.defs.appendChild (this.filterDef);
    }

    Trace.debug ("setting svgPropertyValue to '" + "url(#" + this.filterId + ")'");
    this.svgPropertyValue = "url(#" + this.filterId + ")";
  }
});

DependencyProperties.register (BlurBitmapEffect, "Radius",
			       { defaultValue: 5,
				 svgPeer: "gaussian",
				 svgAttribute: "stdDeviation" });
