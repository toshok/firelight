function LineBreak ()
{
  Inline.apply (this, arguments);
}

LineBreak.prototype = $.extend(new Inline(), {
  createPeer: function (host) {
    this.svgPeer = document.createElementNS (FirelightConsts.SVGns, "tspan");

    var textNode = document.createTextNode ("<br/>");

    this.svgPeer.appendChild (textNode);

    return this.svgPeer;
  }
});

Types.registerType ("System.Windows.Documents", LineBreak);
