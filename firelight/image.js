RegisterType ("System.Windows.Controls", "Image",
	      FrameworkElement,
	      null,
{
  createPeer: function (host) {
    this.svgPeer = document.createElementNS (FirelightConsts.SVGns, "image");

    // hook up any event triggers we might have
    var triggers = this.triggers;
    for (var t = 0; t < triggers.count; t ++) {
      var trigger = triggers.getItemAt (t);
      trigger.hookupTrigger (this, this.svgPeer);
    }

    return this.svgPeer;
  }
});

DependencyProperties.register (Image, "Source",
			       { defaultValue: "",
				 svgAttribute: "href",
				 svgAttributeNS: "http://www.w3.org/1999/xlink"});