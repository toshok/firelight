function SolidColorBrush (color)
{
    Brush.apply (this, []);
}

SolidColorBrush.prototype = $.extend(new Brush(), {
});