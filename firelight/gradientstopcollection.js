function GradientStopCollection ()
{
    Collection.apply (this, arguments);
}

GradientStopCollection.prototype = $.extend(new Collection(), {
    toString: function () {
	    return "GradientStopCollection";
    },
});

