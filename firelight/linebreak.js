RegisterType ("System.Windows.Documents", "LineBreak",
	      Inline, null,
{
  createPeer: function (host) {
    this.svgPeer = document.createElementNS (FirelightConsts.SVGns, "tspan");

    var textNode = document.createTextNode ("<br/>");

    this.svgPeer.appendChild (textNode);

    return this.svgPeer;
  }
});
