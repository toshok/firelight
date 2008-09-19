function Brush ()
{
    DependencyObject.apply (this, arguments);
}

Brush.prototype = $.extend(new DependencyObject(), {
    coerceValueToType: coerceValueToBrush
});

Types.registerType ("System.Windows.Media", Brush);
