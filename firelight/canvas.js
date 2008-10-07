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

  createPeer: function (host) {
    this.svgPeer = document.createElementNS (FirelightConsts.SVGns, "g");

    this.rectPeer = document.createElementNS (FirelightConsts.SVGns, "rect");
    this.svgPeer.appendChild (this.rectPeer);

    // we replace the normal FrameworkElement renderSizeBinding since
    // the width/height attributes on a canvas actually refer to its
    // background rectangle, not the bounds of the canvas itself.
    this.renderSizeBinding = new Binding (this, function () {
					    this.rectPeer.setAttributeNS (null, "width", String(this.renderSize.width));
					    this.rectPeer.setAttributeNS (null, "height", String(this.renderSize.height));
					  });

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
