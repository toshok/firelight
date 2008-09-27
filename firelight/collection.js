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

    removeCollectionChangeHandler: function (handler) {
      for (var i = 0; i < this.changeHandlersHandlers.length; i ++) {
	if (this.changeHandlers[i] == handler) {
	  this.changeHandlers.remove (i);
	  break;
	}
      }
    },

    addItem: function (item) {
      var index = this.items.length;

      var handler = null;
      if (item.addPropertyChangeListener) {
	var that = this;
	handler = function (args) {
	  that.notifyChangeHandlers ({ type: "itemChange",
				       item: item,
				       args: args });
	};

	item.addPropertyChangeListener (null, handler);
      }

      this.items.push ({ obj: item, changeHandler: handler });

      this.setValue (Collection.CountProperty, index + 1);
      this.notifyChangeHandlers ({ type: "add",
				   index: index,
				   newItem: item });
    },

    clear: function  () {
      for (var i = 0; i < this.items.length; i ++) {
	if (this.items[i].handler)
	  this.items[i].obj.removePropertyChangeListener (null, this.items[i].handler);
      }

      this.notifyChangeHandlers ({ type: "clearing" });

      // XXX more here?
      this.items = [];
    },

    removeItem: function (item) {
      throw new Error ("not implemented yet");
    },

    removeItemAt: function (index) {
      throw new Error ("not implemented yet");
    },

    getItemAt: function (index) {
	return this.items[index].obj;
    },

    setItemAt: function (index, item) {
      var old_item = this.items[index];

	if (old_item.handler)
	  old_items.obj.removePropertyChangeListener (null, old_items.handler);

      var handler = null;
      if (item.addPropertyChangeListener) {
	var that = this;
	handler = function (args) {
	  that.notifyChangeHandlers ({ type: "itemChange",
				       item: item,
				       args: args });
	};

	item.addPropertyChangeListener (null, handler);
      }

      this.items[index] = { obj: item, handler: handler };
      this.notifyChangeHandlers ({ type: "change",
				   index: index,
				   oldItem: old_item.obj,
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
    }

});

DependencyProperties.register (Collection, "Count",
			       { defaultValue: 0,
				 readOnly: true });

Types.registerType ("System.Windows", Collection);
