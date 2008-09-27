function TextBlock ()
{
  FrameworkElement.apply (this, arguments);
}

TextBlock.prototype = $.extend(new FrameworkElement(), {
  contentProperty: "Inlines",

  toString: function () {
    return "TextBlock";
  },

  onPropertyChanged: function (args) {
    if (args.property == TextBlock.TextProperty) {
      this.inlines.clear ();

      var run = new Run();
      run.text = args.newValue;

      this.inlines.addItem (run);
    }
  },

  updateTransform: function () {
    console.log ("setting the transform to '" + this.renderTransform.svgPropertyValue +
		 "translate (" + this.renderPosition.x + ","
		 + this.renderPosition.y + ")'");
    this.svgPeer.setAttributeNS (null, "transform",
				 "translate (" + this.renderPosition.x + ","
				               + this.renderPosition.y + ")"
				 + this.renderTransform.svgPropertyValue);
  },

  updateFill: function () {
    this.svgPeer.setAttributeNS (null, "fill",
				 this.foreground.svgPropertyValue);
  },

  createPeer: function (host) {
    this.svgPeer = document.createElementNS (FirelightConsts.SVGns, "text");

    var inlines = this.inlines;
    for (var i = 0; i < inlines.count; i ++) {
      var child_peer = inlines.getItemAt (i).createPeer (host);
      this.svgPeer.appendChild (child_peer);
    }

    var that = this;

    if (this.renderTransform) {
      this.renderTransform.applyToPeer (this.host,
					function (v) {
					  that.updateTransform ();
					});
      this.renderTransform.computePropertyValue();
    }

    if (this.foreground) {
      this.foreground.applyToPeer (this.host,
				   function (v) {
				     that.updateFill();
				   });
      this.foreground.computePropertyValue ();

    }

    this.renderPositionBinding = new Binding (function () {
						that.updateTransform ();
					      });

    return this.svgPeer;
  }
});

DependencyProperties.register (TextBlock, "Text",
			       { defaultValue: "" });

DependencyProperties.register (TextBlock, "Inlines",
			       { defaultValue: function () { return new InlineCollection (); },
				 propertyType: InlineCollection } );

DependencyProperties.register (TextBlock, "Foreground",
			       { propertyType: Brush,
				 affectsRender: true } );

Types.registerType ("System.Windows.Controls", TextBlock);
