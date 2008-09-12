function TriggerCollection ()
{
}

TriggerCollection.prototype = $.extend(new Collection(), {
    toString: function () {
	    return "TriggerCollection";
    },
});

