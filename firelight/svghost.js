function SvgHost ()
{
    this.root = null;
    this.rootVisual = null;
}

SvgHost.prototype = {
    setDOMElement: function (el) {
	this.root = el;

	this.content = document.createElementNS (FirelightConsts.SVGns, "g");
	this.defs = document.createElementNS (FirelightConsts.SVGns, "defs");

	this.content.appendChild (this.defs);

	this.root.appendChild (this.content);
    },

    setRootVisual: function (v) {
	if (this.rootVisual)
	    this.rootVisual.disconnectHost();

	this.rootVisual = v;

	if (this.rootVisual) {
	    // let all the nodes in the hierarchy know about the host
	    this.rootVisual.connectHost (this);

	    // now iterate over the tree, creating peers
	    var rootPeer = this.rootVisual.createPeer (this);

	    // and add it to the dom
	    this.content.appendChild (rootPeer);

	    // measure/arrange.  this should likely be done someplace
	    // else (or possibly in a timeout).

	    // XXX these should be the width/height of the dom element
	    this.rootVisual.measure (new Size (500, 500));

	    this.rootVisual.arrange (new Rect (0, 0, this.rootVisual.desiredSize.width, this.rootVisual.desiredSize.height));


	    var serializer = new XMLSerializer( );
	    var str = serializer.serializeToString( this.root );
	    var pretty = XML( str ).toXMLString( );
	    console.log (pretty);
	}

	window["rootVisual"] = v;
    }
};
