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

  createPeer: function (host) {
    this.svgPeer = document.createElementNS (FirelightConsts.SVGns, "text");

    var inlines = this.inlines;
    for (var i = 0; i < inlines.count; i ++) {
      var child_peer = inlines.getItemAt (i).createPeer (host);
      this.svgPeer.appendChild (child_peer);
    }

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
				 affectsRender: true,
				 svgAttribute: "fill" });

DependencyProperties.register (TextBlock, "FontFamily",
			       { defaultValue: "Lucida Sans Unicode",
				 affectsMeasure: true,
				 svgAttribute: "font-family" });

DependencyProperties.register (TextBlock, "FontSize",
			       { defaultValue: 14.666,
				 affectsMeasure: true,
				 svgAttribute: "font-size" });

DependencyProperties.register (TextBlock, "FontStyle",
			       { defaultValue: "Normal", // should be the font style enum..
				 affectsMeasure: true,
				 svgAttribute: "font-style" });

DependencyProperties.register (TextBlock, "FontWeight",
			       { defaultValue: "Normal", // should be the font weight enum..
				 affectsMeasure: true,
				 svgAttribute: "font-weight" });

Types.registerType ("System.Windows.Controls", TextBlock);
