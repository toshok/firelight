RegisterType ("System.Windows", "UIElement",
	      DependencyObject,
function ()
{
  this.visualLevel = 0;
},

{
  addEventListener: function (eventName, callback) {
    Trace.debug ("XXX addEventListener needs implementing");
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
  }
});

EventManager.registerRoutedEvent (UIElement, "GotFocus", "bubble");
EventManager.registerRoutedEvent (UIElement, "KeyDown", "bubble");
EventManager.registerRoutedEvent (UIElement, "KeyUp", "bubble");
EventManager.registerRoutedEvent (UIElement, "LostFocus", "bubble");
EventManager.registerRoutedEvent (UIElement, "MouseEnter", "bubble");
EventManager.registerRoutedEvent (UIElement, "MouseLeftButtonDown", "bubble");
EventManager.registerRoutedEvent (UIElement, "MouseLeftButtonUp", "bubble");
EventManager.registerRoutedEvent (UIElement, "MouseMove", "bubble");

DependencyProperties.register (UIElement, "IsHitTestVisible",
			       { defaultValue: true });
DependencyProperties.register (UIElement, "OpacityMask",
			       { affectsRender: true });
DependencyProperties.register (UIElement, "Opacity",
			       { defaultValue: 1.0,
				 affectsRender: true,
				 cssAttribute: "opacity" });
DependencyProperties.register (UIElement, "BitmapEffect",
			       { propertyType: BitmapEffect,
				 svgAttribute: "filter" });
DependencyProperties.register (UIElement, "Tag");
DependencyProperties.register (UIElement, "RenderTransform",
			       { defaultValue: function () { return new TransformGroup(); },
				 propertyType: Transform,
				 affectsRender: true,
				 svgAttribute: "transform" });// something more here?
