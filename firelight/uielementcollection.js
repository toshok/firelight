function UIElementCollection ()
{
    Collection.apply (this, arguments);
}

UIElementCollection.prototype = $.extend(new Collection(), {
    toString: function () {
	    return "UIElementCollection";
    },
});

Types.registerType ("System.Windows.Controls", UIElementCollection);
