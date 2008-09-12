function Panel ()
{
}

Panel.prototype = $.extend(new FrameworkElement(), {
    contentProperty: "Children",

    toString: function () {
	    return "Panel";
    },
});

DependencyProperties.register (Panel, "Children",
			       { defaultValue: function () { return new UIElementCollection(); },
				 readOnly: true });
DependencyProperties.register (Panel, "Background");
