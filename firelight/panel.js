function Panel ()
{
  FrameworkElement.apply (this, arguments);

  // XXX there has to be an easier way to do this...
  var panel = this;
  var callback = panel.childrenChanged;
  this.children.addCollectionChangeHandler (function (sender, args) { callback.apply (panel, arguments); });
}

Panel.prototype = $.extend(new FrameworkElement(), {
  contentProperty: "Children",

  childrenChanged: function (col, args) {
    Trace.debug ("in childrenChanged, args = {");
    for (var k in args) { Trace.debug (" " + k + " = " + args[k]); }
    this.invalidateMeasure ();

    if (args.type == "change" || args.type == "remove")
      args.oldItem.setVisualParent (null);
    if (args.type == "change" || args.type == "add")
      args.newItem.setVisualParent (this);
  },

  toString: function () {
    return "Panel";
  },

  getLogicalChildren: function () {
    return this.children;
  }
});

DependencyProperties.register (Panel, "Children",
			       { defaultValue: function () { return new UIElementCollection(); },
				 propertyType: UIElementCollection,
				 readOnly: true });
DependencyProperties.register (Panel, "Background",
			       { propertyType: Brush } );

Types.registerType ("System.Windows.Controls", Panel);
