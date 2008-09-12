function Collection ()
{
    this.items = [];
    this.changeHandlers = [];
}

Collection.prototype = $.extend(new DependencyObject(), {
    toString: function () {
	    return "Collection";
    },

    addCollectionChangeHandler: function (handler) {
	    this.changeHandlers.push (handler);
    },

    // XXX removeCollectionChangeHandler plz

    add: function (item) {
	    var index = this.items.length;
	    this.items.push (item);
	    this.setValue (Collection.CountProperty, index + 1);
	    this.notifyChangeHandlers ({ type: "add",
					 index: index,
					 newItem: item });
    },

    remove: function (item) {
	    throw "not implemented yet";
    },

    removeAt: function (index) {
	    throw "not implemented yet";
    },

    getValueAt: function (index) {
	    throw "not implemented yet";
    },

    setValueAt: function (index, item) {
	    throw "not implemented yet";
    },

    notifyChangeHandlers: function (args) {
	var list = this.changeHandlers;
	if (list.length == 0)
	    return;

	var copy = [];
	for (i = 0; i < list.length; i ++)
	    copy.push (list[i]);

	for (i = 0; i < copy.length; i ++)
	    copy[i] (this, args);
    },

});

DependencyProperties.register (Collection, "Count",
			       { defaultValue: 0,
				 readOnly: true });
