function UIElement ()
{
  DependencyObject.apply (this, arguments);
  this.visualLevel = 0;
}

UIElement.prototype = $.extend(new DependencyObject(), {
  addEventListener: function (eventName, callback) {
    Trace.debug ("XXX addEventListener needs implementing");
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

  setVisualParent: function (p) {
    this.visualParent = p;
    if (this.visualParent)
      this.visualLevel = this.visualParent.visualLevel + 1;
    else
      this.visualLevel = 0;
  },

  invalidateMeasure: function () {
    Trace.debug ("invalidateMeasure");
    if (this.host &&
      (this.visualParent || this.host.rootVisual == this)) {
      this.host.addMeasure (this);
    }
  },

  invalidateArrange: function () {
    Trace.debug ("invalidateArrange");
    if (this.host &&
      (this.visualParent || this.host.rootVisual == this)) {
      this.host.addArrange (this);
    }
  },

  updateLayout: function () {
  },

  toString: function () {
    return "UIElement";
  }
});

DependencyProperties.register (UIElement, "IsHitTestVisible",
			       { defaultValue: true });
DependencyProperties.register (UIElement, "OpacityMask",
			       { affectsRender: true });
DependencyProperties.register (UIElement, "Opacity",
			       { defaultValue: 1.0,
				 affectsRender: true });
DependencyProperties.register (UIElement, "Tag");
DependencyProperties.register (UIElement, "RenderTransform",
			       { defaultValue: function () { return new TransformGroup(); },
				 propertyType: Transform,
				 affectsRender: true });// something more here?

Types.registerType ("System.Windows", UIElement);
