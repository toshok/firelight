RegisterType ("System.Windows.Documents", "Inline",
	      DependencyObject, null,
{
  contentProperty: "Text"
});

DependencyProperties.register (Inline, "Foreground",
			       { propertyType: Brush,
				 affectsRender: true } );

DependencyProperties.register (Inline, "FontFamily",
			       { defaultValue: "Lucida Sans Unicode",
				 affectsMeasure: true,
				 propertyChangedHandler: function (args) {
				   if (this.svgPeer)
				     this.svgPeer.setAttributeNS (null, "font-family", args.newValue);
				 } } );

DependencyProperties.register (Inline, "FontSize",
			       { defaultValue: 14.666,
				 affectsMeasure: true,
				 propertyChangedHandler: function (args) {
				   if (this.svgPeer)
				     this.svgPeer.setAttributeNS (null, "font-size", args.newValue);
				 } } );

DependencyProperties.register (Inline, "FontStyle",
			       { defaultValue: "Normal", // should be the font style enum..
				 affectsMeasure: true,
				 propertyChangedHandler: function (args) {
				   if (this.svgPeer)
				     this.svgPeer.setAttributeNS (null, "font-style", args.newValue);
				 } } );

DependencyProperties.register (Inline, "FontWeight",
			       { defaultValue: "Normal", // should be the font weight enum..
				 affectsMeasure: true,
				 propertyChangedHandler: function (args) {
				   if (this.svgPeer)
				     this.svgPeer.setAttributeNS (null, "font-weight", args.newValue);
				 } } );
