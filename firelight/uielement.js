function UIElement ()
{
}

UIElement.prototype = $.extend(new DependencyObject(), {
    disconnectHost: function () {
	    this.host = null;

	    var logicalChildren = getLogicalChildren ();
	    if (logicalChildren) {
		for (var i = 0; i < logicalChildren.length; i ++)
		    logicalChildren[i].disconnectHost ();
	    }
    },

    connectHost: function (host) {
	    this.host = host;

	    var logicalChildren = getLogicalChildren ();
	    if (logicalChildren) {
		for (var i = 0; i < logicalChildren.length; i ++)
		    logicalChildren[i].connectHost (host);
	    }
    },

    getVisualParent: function () {
	    return null; // XXX
    },

    invalidateMeasure: function () {
    },

    invalidateArrange: function () {
    },

    updateLayout: function () {
    },

    toString: function () {
	    return "UIElement";
    },
});

DependencyProperties.register (UIElement, "IsHitTestVisible",
			       { defaultValue: true });
DependencyProperties.register (UIElement, "OpacityMask");
DependencyProperties.register (UIElement, "Opacity",
			       { defaultValue: 1.0 });
DependencyProperties.register (UIElement, "Tag");
DependencyProperties.register (UIElement, "Triggers",
			       { defaultValue: function () { return new TriggerCollection(); } });
