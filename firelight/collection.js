function Collection ()
{
    DependencyObject.apply (this, arguments);

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

    addItem: function (item) {
	    var index = this.items.length;
	    this.items.push (item);
	    this.setValue (Collection.CountProperty, index + 1);
	    this.notifyChangeHandlers ({ type: "add",
					 index: index,
					 newItem: item });
    },

    removeItem: function (item) {
	    throw "not implemented yet";
    },

    removeItemAt: function (index) {
	    throw "not implemented yet";
    },

    getItemAt: function (index) {
	    return this.items[index];
    },

    setItemAt: function (index, item) {
	    var old_item = this.items[index];
	    this.items[index] = item;
	    this.notifyChangeHandlers ({ type: "change",
					 index: index,
					 oldItem: old_item,
					 newItem: item });
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
