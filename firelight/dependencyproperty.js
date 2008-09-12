var DependencyProperties = {
    
    registerAttached: function (ownerType, name, metadata) {
	var prop = new DependencyProperty (this.getKey (ownerType, name), ownerType, name, true, metadata);

	this.registerDependencyProperty (prop);

	this.defineAccessors (prop);

	return prop;
    },

    register: function (ownerType, name, metadata) {

	var prop = new DependencyProperty (this.getKey (ownerType, name), ownerType, name, false, metadata);

	this.registerDependencyProperty (prop);

	this.defineAccessors (prop);

	return prop;
    },



    /////////////////
    // private stuff
    dependency_properties: {},

    getKey: function (ownerType, name) {
	return ownerType.name + "." + name;
    },

    defineAccessors: function (prop) {
	// define the XXXProperty getter on the ownerType
	prop.ownerType.__defineGetter__ (prop.name + "Property", function () { return prop; });
	// and a setter that just throws an exception
	prop.ownerType.__defineSetter__ (prop.name + "Property", function (val) { throw "You can't overwrite a registered DependencyProperty"; });

	if (prop.attached) {
	    prop.ownerType["get" + prop.name] = function () { return obj.getValue (prop) };
	    if (!prop.metadata || !prop.metadata.readOnly)
		prop.ownerType["set" + prop.name] = function (obj, v) { obj.setValue (prop, v); };
	}
	else {
	    var downcasedName = prop.name[0].toLowerCase() + prop.name.substring(1);
	    prop.ownerType.prototype.__defineGetter__ (downcasedName, function () { return this.getValue (prop); });
	    if (!prop.metadata || !prop.metadata.readOnly)
		prop.ownerType.prototype.__defineSetter__ (downcasedName, function (val) { return this.setValue (prop, val); });
	}
    },

    registerDependencyProperty: function (dp) {
    
	if (this.dependency_properties [ dp.key ] != null) throw ("DependencyProperty " + dp.key + " already registered");

	this.dependency_properties [ dp.key ] = dp;
    }
};

function DependencyProperty (key, ownerType, name, attached, metadata) {
    this.key = key;
    this.name = name;
    this.ownerType = ownerType;
    this.attached = attached;
    this.metadata = metadata || null;
}

DependencyProperty.prototype = $.extend (new Object(), {
	toString: function () {
	    return "DependencyProperty: " + this.ownerType.name + "." + this.name + "";
	},
});

