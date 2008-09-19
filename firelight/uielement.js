function UIElement ()
{
    DependencyObject.apply (this, arguments);
}

UIElement.prototype = $.extend(new DependencyObject(), {
    addEventListener: function (eventName, callback) {
	console.log ("XXX addEventListener needs implementing");
    },

    disconnectHost: function () {
	this.host = null;

	var logicalChildren = this.getLogicalChildren ();
	if (logicalChildren instanceof Collection) {
	    for (var i = 0; i < logicalChildren.count; i ++)
		logicalChildren.getItemAt(i).disconnectHost ();
	}
    },

    connectHost: function (host) {
	this.host = host;

	var logicalChildren = this.getLogicalChildren ();
	if (logicalChildren instanceof Collection) {
	    for (var i = 0; i < logicalChildren.count; i ++)
		logicalChildren.getItemAt(i).connectHost (host);
	}
    },

    getLogicalChildren: function () {
	return null;
    },

    getVisualParent: function () {
	return this.visualParent; // XXX
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
DependencyProperties.register (UIElement, "OpacityMask",
			       { affectsRender: true });
DependencyProperties.register (UIElement, "Opacity",
			       { defaultValue: 1.0,
				 affectsRender: true });
DependencyProperties.register (UIElement, "Tag");
DependencyProperties.register (UIElement, "Triggers",
			       { defaultValue: function () { return new TriggerCollection(); } });
DependencyProperties.register (UIElement, "RenderTransform",
			       { defaultValue: function () { return new TransformGroup(); },
				 propertyType: Transform,
				 affectsRender: true });// something more here?

Types.registerType ("System.Windows", UIElement);
