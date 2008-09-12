function SvgHost ()
{
    this.root = null;
    this.rootVisual = null;
}

SvgHost.prototype = {
    setDOMElement: function (el) {
	this.root = el;
    },

    setRootVisual: function (v) {
	if (this.rootVisual)
	    this.rootVisual.disconnectHost();

	this.rootVisual = v;

	if (this.rootVisual) {
	    this.rootVisual.connectHost (this);

	    // measure/arrange.  this should likely be done someplace
	    // else (or possibly in a timeout).

	    this.rootVisual.measure (new Size (500, 500));
	    this.rootVisual.arrange (this.rootVisual.desiredSize);
	}
    },

    render: function () {
	if (this.rootVisual)
	    this.rootVisual.visit (new SvgRenderVisitor(this.root));
    },
};

function SvgRenderVisitor(root)
{
    console.log ("SvgRenderVisitor (" + (root ? root : "whu?") + ")");

    // create our defs container for gradients/etc
    this.defId = 0;
    this.defs = document.createElementNS ("http://www.w3.org/2000/svg", "defs");
    root.appendChild (this.defs);

    this.elements = [root];
}

SvgRenderVisitor.prototype = {
    getCurrent: function () {
	console.log ("element list is " + this.elements.length + " items long");
	return this.elements[this.elements.length-1];
    },

    pushElement: function (el) {
	var cur = this.getCurrent();
	if (!cur)
	    return;
	cur.appendChild (el);
	this.elements.push (el);
	console.log ("pushed element " + el.localName + " onto stack as child of " + cur.localName);
    },

    popElement: function () {
	this.elements.pop ();
    },

    beginVisitCanvas: function (canvas) {
	var peer = document.createElementNS ("http://www.w3.org/2000/svg", "g");
	this.pushElement (peer);
    },

    endVisitCanvas: function (canvas) {
    },

    visitCanvas: function (canvas) {
	// we only make it here if there's a background, so create a rect and give it that background
	var peer = document.createElementNS ("http://www.w3.org/2000/svg", "rect");
	if (this.fill_style) {
	    peer.setAttributeNS (null, "fill", this.fill_style);
	}
	peer.setAttributeNS (null, "x", "50");
	peer.setAttributeNS (null, "y", "50");
	peer.setAttributeNS (null, "width", String(canvas.renderSize.width));
	peer.setAttributeNS (null, "height", String(canvas.renderSize.height));
	this.pushElement (peer);
	this.popElement ();
    },

    visitRectangle: function (rectangle) {
    },

    visitSolidColorBrush: function (brush) {
	this.fill_style = brush.color;
    },

    visitLinearGradientBrush: function (brush) {
	var id = this.defId++;
	var gradient = document.createElementNS ("http://www.w3.org/2000/svg", "linearGradient");

	gradient.setAttributeNS (null, "id", "defs"+id);

	for (var i = 0; i < brush.gradientStops.count; i ++) {
	    var stop = brush.gradientStops.getItemAt(i);
	    var peer = document.createElementNS ("http://www.w3.org/2000/svg", "stop");
	    console.log ("creating <stop offset="+ stop.offset + " color=" + stop.color + " />");
	    peer.setAttributeNS (null, "offset", stop.offset);
	    peer.setAttributeNS (null, "color", stop.color);
	    gradient.appendChild (peer);
	}

	this.defs.appendChild (gradient);
	this.fill_style = "url(#defs"+id+")";
    },
};