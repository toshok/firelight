function Canvas ()
{
  Panel.apply (this, arguments);
}

Canvas.prototype = $.extend(new Panel(), {
  toString: function () {
    return "Canvas";
  },

  measureOverride: function (availableSize) {
    console.log ("BEGIN Canvas.measureOverride (" + this.name + "), availableSize = " + availableSize);
    var result = this.__proto__.__proto__.measureOverride (availableSize);

    // XXX ugly hack to maintain compat
    if (!this.getVisualParent () && this.host.rootVisual != this) {
      console.log ("RETURN EARLY Canvas.measureOverride (" + this.name + ")");
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
    console.log ("BEGIN Canvas.arrangeOverride (" + this.name + "), finalSize = " + finalSize);
    var result = this.__proto__.__proto__.arrangeOverride (finalSize);

    // XXX ugly hack to maintain compat
    if (!this.getVisualParent () && this.host.rootVisual != this) {
      console.log ("RETURN EARLY Canvas.arrangeOverride (" + this.name + "), " + result);
      return result;
    }

    var children = this.children;
    for (var i = 0; i < children.count; i ++) {
      var child = children.getItemAt (i);
      child.arrange (new Rect (Canvas.getLeft (child), Canvas.getTop(child),
			       Infinity, Infinity));
      // XXX fill layout slot?
    }

    console.log ("RETURN Canvas.arrangeOverride (" + this.name + "), " + result);
    return result;
  },

  createPeer: function (host) {
    var peer = document.createElementNS (FirelightConsts.SVGns, "g");
    if (this.renderTransform) {
      this.renderTransform.applyToPeer (host, peer, "transform");
    }

    var that = this;
    this.renderPositionBinding = new Binding (function () {
						peer.setAttributeNS (null, "x", String(that.renderPosition.x));
						peer.setAttributeNS (null, "y", String(that.renderPosition.y));
					      });

    if (this.background) {
      var rect = document.createElementNS (FirelightConsts.SVGns, "rect");
      this.background.applyToPeer (host, rect, "fill");

      this.renderSizeBinding = new Binding (function () {
					      // XXX these need an automatic binding so things update properly
					      rect.setAttributeNS (null, "width", String(that.renderSize.width));
					      rect.setAttributeNS (null, "height", String(that.renderSize.height));
					    });

      this.renderSizeBinding.update ();

      peer.appendChild(rect);
    }

    // XXX we need to bind children collection changes to regenerate the svg peers
    var children = this.children;
    for (var i = 0; i < children.count; i ++) {
      var child_peer = children.getItemAt (i).createPeer (host);
      peer.appendChild (child_peer);
    }

    this.svgPeer = peer;
    return peer;
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
