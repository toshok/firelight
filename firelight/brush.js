function Brush ()
{
    DependencyObject.apply (this, arguments);
}

Brush.prototype = $.extend(new DependencyObject(), {
    coerceValueToType: coerceValueToBrush
});

DependencyProperties.register (Brush, "SvgPropertyValue",
			       { defaultValue: "",
				 alwaysNotify: true });

Types.registerType ("System.Windows.Media", Brush);
