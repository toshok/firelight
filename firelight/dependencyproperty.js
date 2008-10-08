var DependencyProperties = new function () {

  /////////////////
  // private stuff
  var dependency_properties = {};

  function getKey (ownerType, name) {
    var typeName = ownerType.name;

    if (!typeName) throw "unable to determine type name when registering '" + name + "' property";

    return typeName + "." + name;
  };

  function defineAccessors (prop) {
    // define the XXXProperty getter on the ownerType
    prop.ownerType.prototype.__defineGetter__ (prop.name + "Property", function () { return prop; });
    // and a setter that just throws an exception
    prop.ownerType.prototype.__defineSetter__ (prop.name + "Property", function (val) { throw "You can't overwrite a registered DependencyProperty"; });
    // now put a convenient getter on the constructor so we don't have
    // to put '.prototype' in all references to the DP
    prop.ownerType.__defineGetter__ (prop.name + "Property", function () { return prop; });

    if (prop.attached) {
      prop.ownerType["get" + prop.name] = function (obj) { return obj.getValue (prop); };
      if (!prop.metadata || !prop.metadata.readOnly)
	prop.ownerType["set" + prop.name] = function (obj, v) { obj.setValue (prop, v); };
      }
      else {
	var downcasedName = prop.name[0].toLowerCase() + prop.name.substring(1);
	prop.ownerType.prototype.__defineGetter__ (downcasedName, function () { return this.getValue (prop); });
	if (!prop.metadata || !prop.metadata.readOnly)
	  prop.ownerType.prototype.__defineSetter__ (downcasedName, function (val) { return this.setValue (prop, val); });
      }
  };

  function registerDependencyProperty (dp) {

    if (dependency_properties [ dp.key ] != null) throw ("DependencyProperty " + dp.key + " already registered");

    dependency_properties [ dp.key ] = dp;
  }

  /////////////////
  // public stuff
  return {
    registerAttached: function (ownerType, name, metadata) {
      var prop = new DependencyProperty (getKey (ownerType, name), ownerType, name, true, metadata);

      registerDependencyProperty (prop);

      defineAccessors (prop);

      return prop;
    },

    register: function (ownerType, name, metadata) {
      var prop = new DependencyProperty (getKey (ownerType, name), ownerType, name, false, metadata);

      registerDependencyProperty (prop);

      defineAccessors (prop);

      return prop;
    }
  };
};

function DependencyProperty (key, ownerType, name, attached, metadata) {
  this.key = key;
  this.name = name;
  this.ownerType = ownerType;
  this.attached = attached;
  this.metadata = metadata || null;

  this.resolvePropertyType = function () {
    if ("propertyType" in this)
      return this.propertyType;

    if (metadata) {
      if (metadata.propertyType) {
	this.propertyType = metadata.propertyType;
      }
      else if ("defaultValue" in metadata) {
	var v;
	if (typeof (metadata.defaultValue) == "function")
	  v = metadata.defaultValue ();
	else
	  v = metadata.defaultValue;

	var tof = typeof (v);
	if (tof == "string")
	  this.propertyType = String;
	else if (tof == "number")
	  this.propertyType = Number;
	else if (typeof (this.propertyType) == "function") {
	  if ("type" in v)
	    this.propertyType = v.type;
	  else
	    throw new Error ("can't determine propertyType using defaultValue of " + this.key);
	}
	else {
	  throw new Error ("unrecognized property type for DependencyProperty " + this.key);
	}
      }
      else {
	this.propertyType = null;
      }
    }

    return this.propertyType;
  };
}

DependencyProperty.prototype = $.extend (new Object(), {
  toString: function () {
    return this.key;
  }
});

