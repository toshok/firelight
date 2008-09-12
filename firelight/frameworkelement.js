function FrameworkElement ()
{
    UIElement.apply (this, arguments);
}

FrameworkElement.prototype = $.extend(new UIElement(), {

    measureOverride: function (size) {
	    console.log ("in FrameworkElement.measureOverride");

	    if (!this.getVisualParent() || this.getVisualParent().constructor == Canvas)
		return new Size (NaN, NaN);

	    return new Size (this.Width, this.Height);
    },

    arrangeOverride: function (rect) {
	    console.log ("in FrameworkElement.arrangeOverride");
	    if (!this.getVisualParent () || this.getVisualParent ().constructor == Canvas)
		return new Size (NaN,NaN);
    },

    toString: function () {
	    return "FrameworkElement";
    },


    measure: function (availableSize) {
	    var specified = new Size (this.width, this.height);

	    var size = availableSize.shrinkBy (this.margin);

	    size = size.min (specified);
	    size = size.max (specified);

	    size = size.min (this.maxWidth, this.maxHeight);
	    size = size.max (this.minWidth, this.minHeight);

	    size = this.measureOverride (size);

	    this.actualWidth = this.width;
	    this.actualHeight = this.height;

	    // XXX ugly hack to fake some sort of exception case
	    if (isNaN (size.width) || isNaN (size.height)) {
		this.desiredSize = new Size (0, 0);
	    }

	    // postcondition the results
	    size = size.min (specified);
	    size = size.max (specified);

	    size = size.min (this.maxWidth, this.maxHeight);
	    size = size.max (this.minWidth, this.minHeight);

	    size = size.growBy (this.margin);

	    size = size.min (availableSize);

	    this.desiredSize = size;
    },

    arrange: function (finalRect) {
	    finalRect.shrinkBy (this.margin);

	    var size = new Size (finalRect.width, finalRect.height);

	    this.arrangeOverride (size);

	    // XXX ugly hack to fake some sort of exception case
	    if (isNaN (size.width) || isNaN (size.height)) {
                this.renderSize = new Size (0,0);
		return;
	    }

	    this.renderSize = size;
	    this.actualWidth = size.width;
	    this.actualHeight = size.height;

	    // XXX what do we do with finalRect.x and y?

	    console.log ("more here in FrameworkElement::Arrange.  move the bounds or something?  set properties?  who knows!?");
    },
});

DependencyProperties.register (FrameworkElement, "Width",
			       { defaultValue: NaN,
				 affectsParentMeasure: true });

DependencyProperties.register (FrameworkElement, "Height",
			       { defaultValue: NaN,
				 affectsParentMeasure: true });

DependencyProperties.register (FrameworkElement, "MinWidth",
			       { defaultValue: 0.0,
				 affectsParentMeasure: true });
DependencyProperties.register (FrameworkElement, "MinHeight",
			       { defaultValue: 0.0,
				 affectsParentMeasure: true });

DependencyProperties.register (FrameworkElement, "MaxWidth",
			       { defaultValue: Infinity,
				 affectsParentMeasure: true });

DependencyProperties.register (FrameworkElement, "MaxHeight",
			       { defaultValue: Infinity,
				 affectsParentMeasure: true });

DependencyProperties.register (FrameworkElement, "Margin",
			       { defaultValue: function () { return { left: 0.0, top: 0.0, right: 0.0, bottom: 0.0 }; },
				 affectsMeasure: true });

Types.registerType ("System.Windows", FrameworkElement);
