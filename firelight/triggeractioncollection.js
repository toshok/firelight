function TriggerActionCollection ()
{
    Collection.apply (this, arguments);
}

TriggerActionCollection.prototype = $.extend(new Collection(), {
    toString: function () {
	return "TriggerActionCollection";
    }
});

Types.registerType ("System.Windows", TriggerActionCollection);
