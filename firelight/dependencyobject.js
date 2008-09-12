function DependencyObject ()
{
    this.propertychange_listeners = {};
    this.properties = {};
}

DependencyObject.prototype = $.extend (new Object(), {
    setValue: function (dp, new_value) {
        if (!dp /*|| dp.constructor.name != "DependencyProperty" */) throw "setValue requires valid DependencyProperty";
	if (typeof new_value == "undefined") throw "you must pass a value to setValue";

	//if (dp.readonly) throw new "Attempting to set a value on read-only property '" + dp.name + "'";
	var old_value = this.properties[dp.key];
	this.properties[dp.key] = new_value;

	if (old_value != new_value) {
	    var args = { "property" : dp,
			 oldValue: old_value,
			 newValue: new_value };

	    this.onPropertyChanged (args);
	    if (dp.metadata && dp.metadata.propertyChangedHandler)
		dp.metadata.propertyChangedHandler (args);
	    this.notifyListenersOfPropertyChange (args);
	}
    },

    getValue: function (dp) {
	if (!(dp.key in this.properties)) {
	    if (dp.metadata) {
		if (typeof (dp.metadata.defaultValue) == "undefined")
		    this.properties[dp.key] = null;
		else
		    this.properties[dp.key] = (typeof (dp.metadata.defaultValue) == "function") ? dp.metadata.defaultValue() : dp.metadata.defaultValue;
	    }
	    else
		this.properties[dp.key] = null;
	}

	return this.properties[dp.key];
    },

    addPropertyChangeListener: function (dp, cb) {
	if (dp == null)
	    this.wildcard_listeners.push (cb);
	else {
	    if (this.propertychange_listeners[dp.key] == null)
		this.propertychange_listeners[dp.key] = [];
	    this.propertychange_listeners[dp.key].push (cb);
	}
    },

    onPropertyChanged: function (args) {
	    // XXX I'm hoping we don't need this method at all
    },

    notifyListenersOfPropertyChange: function (args) {
	var list = this.propertychange_listeners[args.property.key];
	if (list == null)
	    return;

	var copy = [];
	for (i = 0; i < list.length; i ++)
	    copy.push (list[i]);

	for (i = 0; i < copy.length; i ++)
	    copy[i] (this, args);
    },

    toString: function () {
	    return "DependencyObject";
    },
});