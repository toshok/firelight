function DependencyObject ()
{
  this.propertychange_listeners = {};
  this.wildcard_listeners = [];
  this.properties = {};

  this.type = this.__proto__;
}

DependencyObject.prototype = $.extend(new Object(), {
  connectHost: function (host) {
    if (this.host)
      throw new Error ("cannot attach a dependency object to two different hosts.");
    this.host = host;

    for (var dp in this.properties) {
      var val = this.properties[dp];
      if (val && val.connectHost)
	val.connectHost (host);
    }

    var logicalChildren = this.getLogicalChildren ();
    if (logicalChildren /* && logicalChildren instanceof Collection */) {
      for (var i = 0; i < logicalChildren.count; i ++) {
	var child = logicalChildren.getItemAt(i);
	if (child && child.connectHost)
	  child.connectHost (host);
      }
    }
  },

  disconnectHost: function () {
    this.host = null;

    for (var dp in this.properties) {
      var val = this.properties[dp];
      if (val && val.disconnectHost)
	val.disconnectHost (host);
    }

    var logicalChildren = this.getLogicalChildren ();
    if (logicalChildren /* && logicalChildren instanceof Collection */) {
      for (var i = 0; i < logicalChildren.count; i ++) {
	var child = logicalChildren.getItemAt(i);
	if (child && child.disconnectHost)
	  child.disconnectHost (host);
      }
    }
  },

  getLogicalChildren: function () {
    return null;
  },

  setValue: function (dp, new_value) {
    if (!dp || !(dp instanceof DependencyProperty))
      throw new Error ("setValue requires valid DependencyProperty");

    if (typeof new_value == "undefined")
      throw new Error ("setValue(" + dp + ") passed an undefined value");

    //if (dp.readonly) throw new "Attempting to set a value on read-only property '" + dp.name + "'";
    var old_value = this.properties[dp];

    var propertyType = dp.resolvePropertyType ();
    if (!propertyType) throw "unable to resolve property type for " + dp;
    if (propertyType == String) {
      if (typeof (new_value) != "string")
	throw "property " + dp + " requires a string value";
      this.properties[dp] = new_value;
    }
    else if (propertyType == Number) {
      /* be nice and try to automatically convert strings to numbers */
      if (typeof (new_value) == "string") {
	var s = new_value;
	new_value = Number (new_value);
	if (isNaN(new_value) && s != "NaN")
	  throw "property " + dp + " requires a number value";
      }
      if (typeof (new_value) != "number")
	throw "property " + dp + " requires a number value";
      this.properties[dp] = new_value;
    }
    else if (new_value.isSubclass && new_value.isSubclass (propertyType))
      this.properties[dp] = new_value;
    else if (dp.metadata && dp.metadata.coerceValue) {
      this.properties[dp] = dp.metadata.coerceValue (new_value);
    }
    else if (propertyType.prototype.coerceValueToType) {
      this.properties[dp] = propertyType.prototype.coerceValueToType (new_value);
    }
    else
      // XXX punt here, not sure how to deal with opera's lack of __proto__ and therefore failure of isSubclass.
      // throw new Error ("DependencyProperty '" + dp + "' lacks a coerceValue method, and value '" + new_value + "' is not the registered type.");
      this.properties[dp] = new_value;

    if (old_value != new_value || (dp.metadata && dp.metadata.alwaysNotify)) {
      var args = { "property" : dp,
		   oldValue: old_value,
		   newValue: new_value };

      this.onPropertyChanged (args);
      if (dp.metadata && dp.metadata.propertyChangedHandler)
	dp.metadata.propertyChangedHandler.apply (this, [args]);
	this.notifyListenersOfPropertyChange (args);
    }
  },

  getValue: function (dp) {
    if (!(dp in this.properties)) {
      if (dp.metadata) {
	if (typeof (dp.metadata.defaultValue) == "undefined")
	  this.properties[dp] = null;
	else
	  this.properties[dp] = (typeof (dp.metadata.defaultValue) == "function") ? dp.metadata.defaultValue() : dp.metadata.defaultValue;
      }
      else
	this.properties[dp] = null;
    }

    return this.properties[dp];
  },

  isSubclass: function (type) {
    var type_proto = type.prototype;
    var proto = this.__proto__;
    while (proto) {
//      Trace.debug ("isSubclass (" + proto + ", " + type.prototype + ")");
      if (proto == type_proto)
	return true;
      proto = proto.__proto__;
    }
    return false;
  },

  addPropertyChangeListener: function (dp, cb) {
    if (dp == null)
      this.wildcard_listeners.push (cb);
      else {
	if (this.propertychange_listeners[dp] == null)
	  this.propertychange_listeners[dp] = [];
	  this.propertychange_listeners[dp].push (cb);
      }
  },

  removePropertyChangeListener: function (dp, cb) {
    if (dp == null) {
      for (var i = 0; i < this.wildcard_listeners.length; i ++) {
	if (this.wildcard_listeners[i] == cb) {
	  this.wildcard_listeners.remove (i);
	  break;
	}
      }
    }
    else if (this.propertychange_listeners[dp] != null) {
      for (var i = 0; i < this.propertychange_listeners[dp].length; i ++) {
	if ((this.propertychange_listeners[dp])[i] == cb) {
	  this.propertychange_listeners[dp].remove (i);
	  break;
	}
      }
    }
  },

  lookupProperty: function (dpName) {
    return this[dpName + "Property"];
  },

  addChild: function (child) {
    if (!this.contentProperty)
      throw new Error ("you can't add children to a non-collection element which lacks a contentProperty (" + this + ")");
    var contentProp = this.lookupProperty (this.contentProperty);
    if (!contentProp)
      throw new Error ("could not find contentProperty '" + this.contentProperty + "' on element '" + this + "'.");
    var content = this.getValue (contentProp);

    // XXX this should really check the property type instead
    // of the content value (which might be null).
    if (content && content.addItem) {
      content.addItem(child);
    }
    else {
      Trace.debug ("setting contentProp " + contentProp);
      this.setValue (contentProp, child);
    }
  },

  onPropertyChanged: function (args) {
    // XXX I'm hoping we don't need this method at all
  },

  notifyListenerList: function (list, args) {
    if (list == null)
      return;

      var copy = [];
      for (i = 0; i < list.length; i ++)
	copy.push (list[i]);

      for (i = 0; i < copy.length; i ++)
	copy[i] (this, args);
  },

  notifyListenersOfPropertyChange: function (args) {
    this.notifyListenerList (this.propertychange_listeners[args.property], args);
    this.notifyListenerList (this.wildcard_listeners, args);
  },

  applyToPeer: function (host, change_callback) {
    Trace.debug ("in dependencyobject.applyToPeer");

    var valueProp = this.lookupProperty ("SvgPropertyValue");

    Trace.debug (valueProp);

    var that = this;
    this.addPropertyChangeListener (valueProp,
				    function (args) {
				      change_callback (that.getValue (valueProp));
				    });

    // XXX property changes need to be propagated still.
  },

  toString: function () {
    return "DependencyObject";
  }
});

DependencyProperties.register (DependencyObject, "Name",
			       { propertyType: String });

Types.registerType ("System.Windows", DependencyObject);

