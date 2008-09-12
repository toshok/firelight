function Canvas ()
{
}

Canvas.prototype = $.extend(new Panel(), {

	measureOverride: function (available) {
	    var result = this.prototype.measureOverride (availableSize);

	    // XXX ugly hack to maintain compat
	    if (!this.getVisualParent ())
		return result;

	    var children = this.Children;
	    for (var i = 0; i < children.Count; i ++)
		children.getValueAt (i).measure (new Size (Infinity, Infinity));

	    return result;
	},

	arrangeOverride: function (finalSize) {
	    var result = this.prototype.arrangeOverride (finalSizez);

	    // XXX ugly hack to maintain compat
	    if (!this.getVisualParent ())
		return result;

	    var children = this.Children;
	    for (var i = 0; i < children.Count; i ++) {
		var child = children.getValueAt (i);
		child.arrange (new Rect (Canvas.GetLeft (child), Canvas.GetTop(child),
					 Infinity, Infinity));
		// XXX fill layout slot?
	    }

	    return result;
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
