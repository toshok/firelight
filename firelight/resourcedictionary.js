RegisterType ("System.Windows", "ResourceDictionary",
	      Collection,
function ()
{
  this.map = { };
},

{
  getLogicalChildren: function () {
    return this;
  },

  addChild: function (child) {
    if (child.key && child.name) {
      throw new Error ("You can't specify both x:Name and x:Key for the same element");
    }
    else if (!child.key && !child.name) {
      throw new Error ("To add an element to a ResourceDictionary, you must specify one of x:Name and x:Key");
    }

    var key = child.key ? child.key : child.name;

    this.addResource (key, child);
  },

  addResource: function (key, val) {
    if (key in this.map)
      throw new Error ("You can't have two resources with the same x:Key");

    this.map[key] = val;

    Collection.prototype.addItem.apply (this, [val]);
  },

  removeResource: function (key) {
    if (!(key in this.map))
      return;

    var val = this.map[key];

    delete this.map[key];

    Collection.prototype.removeItem.apply (this, [val]);
  }
});
