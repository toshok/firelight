function TriggerCollection ()
{
    Collection.apply (this, arguments);
}

TriggerCollection.prototype = $.extend(new Collection(), {
    toString: function () {
	    return "TriggerCollection";
    },
});

