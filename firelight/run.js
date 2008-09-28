function Run ()
{
  Inline.apply (this, arguments);
}

Run.prototype = $.extend(new Inline(), {
  contentProperty: "Text",

  toString: function () {
    return "Run";
  },

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

Types.registerType ("System.Windows.Documents", Run);
