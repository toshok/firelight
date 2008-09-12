function HtmlCanvasHost (el)
{
    this.el = el;
}

HtmlCanvasHost.prototype = {
    setRootVisual: function (v) {
	if (this.rootVisual)
	    this.rootVisual.disconnectHost();

	this.rootVisual = v;

	if (this.rootVisual) {
	    this.rootVisual.connectHost (this);

	    // measure/arrange.  this should likely be done someplace else.

	    this.rootVisual.measure (new Size (500, 500));
	    this.rootVisual.arrange (this.rootVisual.desiredSize);
	}
    },

    render: function () {
	if (this.rootVisual)
	    this.rootVisual.walkLogicalTree (new HtmlCanvasVisitor(this));
    },
};

function HtmlCanvasVisitor() { }
HtmlCanvasVisitor.prototype = {
    visitCanvas: function (canvas) {
    },
    visitRectangle: function  (rectangle) {
    },
};