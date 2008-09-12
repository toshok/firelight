function Panel ()
{
    FrameworkElement.apply (this, arguments);

    // XXX there has to be an easier way to do this...
    var panel = this;
    var callback = this.childrenChanged;
    this.children.addCollectionChangeHandler (function (sender, args) { callback.apply (panel, arguments); });
}

Panel.prototype = $.extend(new FrameworkElement(), {
    contentProperty: "Children",

    childrenChanged: function (col, args) {
	    console.log ("in childrenChanged, args = {");
	    for (var k in args) { console.log (" " + k + " = " + args[k]); }
	    this.invalidateMeasure ();
    },

    toString: function () {
	    return "Panel";
    },

    getLogicalChildren: function () {
	    return this.children;
    },
});

DependencyProperties.register (Panel, "Children",
			       { defaultValue: function () { return new UIElementCollection(); },
				 readOnly: true });
DependencyProperties.register (Panel, "Background");
