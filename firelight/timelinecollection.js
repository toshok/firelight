function TimelineCollection ()
{
    Collection.apply (this, arguments);
}

TimelineCollection.prototype = $.extend(new Collection(), {
    toString: function () {
	return "TimelineCollection";
    }
});

Types.registerType ("System.Windows.Media.Animation", TimelineCollection);
