function HtmlCanvasHost ()
{
}

HtmlCanvasHost.prototype = {
    setCanvas: function (el) {
	this.element = el;
	if (!el)
	    console.log ("huh-huh?");
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
	if (!this.element)
	    console.log ("huh?");
	if (this.rootVisual)
	    this.rootVisual.visit (new HtmlCanvasRenderVisitor(this.element));
    },
};

function HtmlCanvasRenderVisitor(el)
{
    this.ctx = el.getContext("2d");
}

HtmlCanvasRenderVisitor.prototype = {
    visitCanvas: function (canvas) {
	console.log ("visitCanvas");
	this.ctx.fillRect (0, 0, canvas.renderSize.width, canvas.renderSize.height);
    },
    visitRectangle: function (rectangle) {
    },
    visitSolidColorBrush: function (brush) {
	console.log ("visitSolidColorBrush");
	console.log ("setting fillStyle to " + brush.color);
	this.ctx.fillStyle = brush.color;
    }
};