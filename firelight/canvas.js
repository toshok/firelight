function Canvas ()
{
    Panel.apply (this, arguments);
}

Canvas.prototype = $.extend(new Panel(), {

	measureOverride: function (availableSize) {
	    console.log ("in Canvas.measureOverride");
	    var result = this.__proto__.__proto__.measureOverride (availableSize);

	    // XXX ugly hack to maintain compat
	    if (!this.getVisualParent () && this.host.rootVisual != this) {
		console.log ("returning early");
		return result;
	    }

	    var children = this.children;
	    for (var i = 0; i < children.count; i ++) {
		var child = children.getItemAt (i);
		child.measure (new Size (Infinity, Infinity));
	    }

	    return result;
	},

	arrangeOverride: function (finalSize) {
	    console.log ("in Canvas.arrangeOverride");
	    var result = this.__proto__.__proto__.arrangeOverride (finalSize);

	    // XXX ugly hack to maintain compat
	    if (!this.getVisualParent () && this.host.rootVisual != this) {
		console.log ("returning early");
		return result;
	    }

	    var children = this.children;
	    for (var i = 0; i < children.count; i ++) {
		var child = children.getItemAt (i);
		child.arrange (new Rect (Canvas.getLeft (child), Canvas.getTop(child),
					 Infinity, Infinity));
		// XXX fill layout slot?
	    }

	    return result;
	},

	visit: function (visitor) {
	    if (visitor.beginVisitCanvas)
		visitor.beginVisitCanvas (this)

	    if (this.background) {
		this.background.visit (visitor);
		visitor.visitCanvas (this);
	    }

	    var children = this.children;
	    for (var i = 0; i < children.count; i ++)
		children.getItemAt (i).visit (visitor);

	    if (visitor.endVisitCanvas)
		visitor.endVisitCanvas (this)
	},

    toString: function () {
	    return "Canvas";
    },

});

DependencyProperties.registerAttached (Canvas, "Left",
				       { defaultValue: 0.0,
					 affectsParentMeasure: true });
DependencyProperties.registerAttached (Canvas, "Top",
				       { defaultValue: 0.0,
					 affectsParentMeasure: true });
DependencyProperties.registerAttached (Canvas, "ZIndex",
				       { defaultValue: 0,
					 affectsRender: true });

Types.registerType ("System.Windows.Controls", Canvas);
