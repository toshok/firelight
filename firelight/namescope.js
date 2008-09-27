function NameScope ()
{
  DependencyObject.apply (this, arguments);
  this.names = { };
}

NameScope.prototype = $.extend (new DependencyObject(), {
  toString: function () {
    return "NameScope";
  },

  registerName: function (name, obj) {
    if (name in this.names)
      throw new Error ("name '" + name + "' is already registered in this namescope.");
    this.names[name] = obj;
  },

  unregisterName: function (name) {
    delete this.names[name];
  },

  findName: function (name) {
    if (name in this.names)
      return this.names[name];
    if (this.parentNamescope)
      return this.parentNamescope.findName (name);
    return null;
  }
});

DependencyProperties.registerAttached (NameScope, "NameScope",
				       { defaultValue: null,
					 propertyType: NameScope });
