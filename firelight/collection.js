RegisterType ("System.Windows",
	      "Collection",
	      DependencyObject,
function () {
  this.items = [];
  this.changeHandlers = [];
},

{
  // the interface the parser uses
  addChild: function (child) {
    this.addItem (child);
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

  checkItemType: function (item) {
    if (this.elementType == Object)
      /* everything is allowed */;
    else if (item.isSubclass)
      if (!item.isSubclass (this.elementType))
	throw new Error (this + " requires children of type " + this.elementType.typeName);
  },

  addItem: function (item) {
    this.checkItemType (item);

    var index = this.items.length;

    var handler = null;
    if (item.addPropertyChangeListener) {
      var that = this;
      handler = function (sender, args) {
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
    this.checkItemType (item);
    
    var old_item = this.items[index];

    if (old_item.handler)
      old_items.obj.removePropertyChangeListener (null, old_items.handler);

    var handler = null;
    if (item.addPropertyChangeListener) {
      var that = this;
      handler = function (sender, args) {
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
