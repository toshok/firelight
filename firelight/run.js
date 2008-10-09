RegisterType ("System.Windows.Documents", "Run",
	      Inline, null,
{
  contentProperty: "Text",

  createPeer: function (host) {
    this.svgPeer = document.createElementNS (FirelightConsts.SVGns, "tspan");

    var textNode = document.createTextNode (this.text);

    this.svgPeer.appendChild (textNode);

    this.svgPeer.setAttributeNS (null, "font-family", this.fontFamily);
    this.svgPeer.setAttributeNS (null, "font-size", this.fontSize);
    this.svgPeer.setAttributeNS (null, "font-weight", this.fontWeight);

    return this.svgPeer;
  }
});

DependencyProperties.register (Run, "Text",
			       { defaultValue: "" });
