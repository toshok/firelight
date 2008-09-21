function DependencyObject ()
{
  this.propertychange_listeners = {};
  this.wildcard_listeners = [];
  this.properties = {};

  this.type == this.__proto__;
}

DependencyObject.prototype = $.extend(new Object(), {
  setValue: function (dp, new_value) {
    if (!dp || !(dp instanceof DependencyProperty))
      throw new Error ("setValue requires valid DependencyProperty");

    if (typeof new_value == "undefined")
      throw new Error ("setValue(" + dp.key + ") passed an undefined value");

    //if (dp.readonly) throw new "Attempting to set a value on read-only property '" + dp.name + "'";
    var old_value = this.properties[dp.key];

    var propertyType = dp.resolvePropertyType ();
    if (!propertyType) throw "unable to resolve property type for " + dp.key;
    if (propertyType == String) {
      if (typeof (new_value) != "string")
	throw "property " + dp.key + " requires a string value";
      this.properties[dp.key] = new_value;
    }
    else if (propertyType == Number) {
      /* be nice and try to automatically convert strings to numbers */
      if (typeof (new_value) == "string")
	new_value = Number (new_value);
      if (typeof (new_value) != "number")
	throw "property " + dp.key + " requires a number value";
      this.properties[dp.key] = new_value;
    }
    else if (new_value.isSubclass && new_value.isSubclass (propertyType))
      this.properties[dp.key] = new_value;
    else if (dp.metadata && dp.metadata.coerceValue) {
      this.properties[dp.key] = dp.metadata.coerceValue (new_value);
    }
    else if (propertyType.prototype.coerceValueToType) {
      this.properties[dp.key] = propertyType.prototype.coerceValueToType (new_value);
    }
    else
      throw new Error ("DependencyProperty '" + dp.key + "' lacks a coerceValue method, and value '" + new_value + "' is not the registered type.");

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

  isSubclass: function (type) {
    var type_proto = type.prototype;
    var proto = this.__proto__;
    while (proto) {
      console.log ("isSubclass (" + proto + ", " + type.prototype + ")");
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
	if (this.propertychange_listeners[dp.key] == null)
	  this.propertychange_listeners[dp.key] = [];
	  this.propertychange_listeners[dp.key].push (cb);
      }
  },

  lookupProperty: function (dpName) {
    var p = this.__proto__;
    dpName = dpName + "Property";

    while (p) {
      if (dpName in p)
	return p[dpName];

      p = p.__proto__;
    }
    return null;
  },

  addChild: function (child) {
    var content;
    if (this.isSubclass (Collection)) {
      content = this;
    }
    else {
      if (!this.contentProperty)
	throw new Error ("you can't add children to a non-collection element which lacks a contentProperty (" + this + ")");
      var contentProp = this.lookupProperty (this.contentProperty);
      if (!contentProp)
	throw new Error ("could not find contentProperty '" + this.contentProperty + "' on element '" + this + "'.");
      content = this.getValue (contentProp);
    }

    // XXX this should really check the property type instead
    // of the content value (which might be null).
    if (content && content.addItem) {
      content.addItem(child);
    }
    else {
      console.log ("setting contentProp " + contentProp);
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
    this.notifyListenerList (this.propertychange_listeners[args.property.key], args);
    this.notifyListenerList (this.wildcard_listeners, args);
  },

  applyToPeer: function (host, peer, property) {
    console.log ("in dependencyobject.applyToPeer");
    this.appliedToPeer = peer;
    this.appliedToProperty = property;

    console.log ("setting " + property + " to " + this.computePropertyValue());
    peer.setAttributeNS (null, property, this.computePropertyValue());

    // XXX property changes need to be propagated still.
  },

  toString: function () {
    return "DependencyObject";
  }
});

DependencyProperties.register (DependencyObject, "Name",
			       { propertyType: String });

Types.registerType ("System.Windows", DependencyObject);

