function Canvas ()
{
  Panel.apply (this, arguments);
}

Canvas.prototype = $.extend(new Panel(), {
  toString: function () {
    return "Canvas";
  },

  measureOverride: function (availableSize) {
    Trace.debug ("BEGIN Canvas.measureOverride (" + this.name + "), availableSize = " + availableSize);
    var result = FrameworkElement.prototype.measureOverride.call (this, availableSize);

    // XXX ugly hack to maintain compat
    if (!this.getVisualParent () && this.host.rootVisual != this) {
      Trace.debug ("RETURN EARLY Canvas.measureOverride (" + this.name + ")");
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
    Trace.debug ("BEGIN Canvas.arrangeOverride (" + this.name + "), finalSize = " + finalSize);
    var result = FrameworkElement.prototype.arrangeOverride.call (this, finalSize);

    // XXX ugly hack to maintain compat
    if (!this.getVisualParent () && this.host.rootVisual != this) {
      Trace.debug ("RETURN EARLY Canvas.arrangeOverride (" + this.name + "), " + result);
      return result;
    }

    var children = this.children;
    for (var i = 0; i < children.count; i ++) {
      var child = children.getItemAt (i);
      child.arrange (new Rect (Canvas.getLeft (child), Canvas.getTop(child),
			       Infinity, Infinity));
      // XXX fill layout slot?
    }

    Trace.debug ("RETURN Canvas.arrangeOverride (" + this.name + "), " + result);
    return result;
  },

  updateTransform: function () {
    console.log ("setting the transform to '" + this.renderTransform.svgPropertyValue +
		 "translate (" + this.renderPosition.x + ","
		 + this.renderPosition.y + ")'");
    this.svgPeer.setAttributeNS (null, "transform",
				 "translate (" + this.renderPosition.x + ","
				               + this.renderPosition.y + ")"
				 + this.renderTransform.svgPropertyValue);
  },

  updateRectFill: function () {
    this.rectPeer.setAttributeNS (null, "fill",
				  this.background.svgPropertyValue);
  },

  createPeer: function (host) {
    this.svgPeer = document.createElementNS (FirelightConsts.SVGns, "g");

    var that = this;

    if (this.renderTransform) {
      this.renderTransform.applyToPeer (this.host,
					function (v) {
					  that.updateTransform ();
					});
      this.renderTransform.computePropertyValue();
    }


    this.renderPositionBinding = new Binding (function () {
						that.updateTransform ();
					      });

    if (this.background) {
      this.rectPeer = document.createElementNS (FirelightConsts.SVGns, "rect");
      this.background.applyToPeer (this.host,
				   function (v) {
				     that.updateRectFill();
				   });
      this.background.computePropertyValue ();

      this.renderSizeBinding = new Binding (function () {
					      // XXX these need an automatic binding so things update properly
					      that.rectPeer.setAttributeNS (null, "width", String(that.renderSize.width));
					      that.rectPeer.setAttributeNS (null, "height", String(that.renderSize.height));
					    });

      this.renderSizeBinding.update ();

      this.svgPeer.appendChild(this.rectPeer);
    }

    // XXX we need to bind children collection changes to regenerate the svg peers
    var children = this.children;
    for (var i = 0; i < children.count; i ++) {
      var child_peer = children.getItemAt (i).createPeer (host);
      this.svgPeer.appendChild (child_peer);
    }

    // hook up any event triggers we might have
    var triggers = this.triggers;
    for (var t = 0; t < triggers.count; t ++) {
      var trigger = triggers.getItemAt (t);
      trigger.hookupTrigger (this, this.svgPeer);
    }
    return this.svgPeer;
  }
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
