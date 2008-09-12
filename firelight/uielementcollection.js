function UIElementCollection ()
{
}

UIElementCollection.prototype = $.extend(new Collection(), {
    toString: function () {
	    return "UIElementCollection";
    },
});

