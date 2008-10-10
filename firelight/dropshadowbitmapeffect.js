RegisterType ("System.Windows.Media.Effects", "DropShadowBitmapEffect",
	      BitmapEffect, null,
{
  computePropertyValue: function () {
    if (!this.filterId) {
      this.filterId = getDefId ();


      // this isn't full featured yet -- it lacks support for Opacity and Color.
      //
      // we want something that looks like:
      //
      // <filter id="$FILTERID">
      //   <feGaussianBlur in="SourceAlpha" stdDeviation="$SOFTNESS" result="blur"/>
      //   <feOffset in="blur" dx="$DX" dy="$DY" result="Shadow"/>
      //
      //   <feMerge>
      //    <feMergeNode in="Shadow"/>
      //    <feMergeNode in="SourceGraphic"/>
      //   </feMerge>
      // </filter>

      var stdDeviation = Math.min (1.0, Math.max (0.0, this.softness)) * 10;
      var direction = (this.direction % 360);
      var dx = Math.cos(direction * Math.PI / 180) * this.shadowDepth;
      var dy = Math.sin(direction * Math.PI / 180) * this.shadowDepth;

      this.filterDef = document.createElementNS (FirelightConsts.SVGns, "filter");
      this.filterDef.setAttributeNS (null, "id", this.filterId);
      this.filterDef.setAttributeNS (null, "filterUnits", "userSpaceOnUse");

      var gaussian = document.createElementNS (FirelightConsts.SVGns, "feGaussianBlur");
      gaussian.setAttributeNS (null, "in", "SourceAlpha");
      gaussian.setAttributeNS (null, "stdDeviation", stdDeviation.toString());
      gaussian.setAttributeNS (null, "result", "blur");
      this.filterDef.appendChild (gaussian);

      var offset = document.createElementNS (FirelightConsts.SVGns, "feOffset");
      offset.setAttributeNS (null, "in", "blur");
      offset.setAttributeNS (null, "dx", dx.toString());
      offset.setAttributeNS (null, "dy", dx.toString());
      offset.setAttributeNS (null, "result", "Shadow");
      this.filterDef.appendChild (offset);

      var feMerge = document.createElementNS (FirelightConsts.SVGns, "feMerge");
      var feMergeNode;

      feMergeNode = document.createElementNS (FirelightConsts.SVGns, "feMergeNode");
      feMergeNode.setAttributeNS (null, "in", "Shadow");
      feMerge.appendChild (feMergeNode);

      feMergeNode = document.createElementNS (FirelightConsts.SVGns, "feMergeNode");
      feMergeNode.setAttributeNS (null, "in", "SourceGraphic");
      feMerge.appendChild (feMergeNode);

      this.filterDef.appendChild (feMerge);

      this.host.defs.appendChild (this.filterDef);
    }

    Trace.debug ("setting svgPropertyValue to '" + "url(#" + this.filterId + ")'");
    this.svgPropertyValue = "url(#" + this.filterId + ")";
  }
});

DependencyProperties.register (DropShadowBitmapEffect, "Color",
			       { defaultValue: "rgba(0,0,0,255)" });

DependencyProperties.register (DropShadowBitmapEffect, "Direction",
			       { defaultValue: 315.0 });

DependencyProperties.register (DropShadowBitmapEffect, "Opacity",
			       { defaultValue: 1 });

DependencyProperties.register (DropShadowBitmapEffect, "ShadowDepth",
			       { defaultValue: 5 });

DependencyProperties.register (DropShadowBitmapEffect, "Softness",
			       { defaultValue: 0.5 });
