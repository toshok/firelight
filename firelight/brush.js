function Brush ()
{
    DependencyObject.apply (this, arguments);
}

Brush.prototype = $.extend(new DependencyObject(), {
});

Types.registerType ("System.Windows.Media", Brush);
