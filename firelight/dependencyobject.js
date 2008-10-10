RegisterType ("System.Windows",
	      "DependencyObject",
	      null,
function () {
  var propertychange_listeners = {};
  var event_listeners = {};
  var wildcard_listeners = [];

  var that = this;
  function lookupNamedField (name, suffix) {
    var dot = name.indexOf ('.');
    if (dot == -1)
      return that[name + suffix];
    else {
      // it's an attached property/event, we need to look it up on the class mentioned in the nodeName.
      var attached_className = name.substring (0, dot);

      // XXX this usage only works for types defined in FirelightConsts.XAMLns
      var attached_nodeType = XamlTypeResolver.resolveType (attached_className);;

      if (!attached_nodeType)
	throw new Error ("could not resolve class " + attached_className + "in context of attached property '" + name + "'.");

	// we need a better way to look up properties than creating an instance...
	var n = new attached_nodeType();
	return n.lookupNamedField (name.substring (dot + 1));
    }
  };

  this.host = null;
  this.properties = {};

  // event listeners
  this.lookupEvent = function (name) {
    return lookupNamedField (name, "Event");
  };

  this.addEventListener = function (evt, cb) {
    if (typeof (evt) == "string")
      evt = this.lookupEvent (evt);
    if (evt == null)
      throw new Error ("invalid event");

    if (event_listeners[evt] == null)
      event_listeners[evt] = [,]; // we do this so that element 0 is already allocated for the xaml reader
    for (var i = 1; i < event_listeners[evt]; i ++) {
      if (!event_listeners[evt][i]) {
	event_listeners[evt][i] = cb;
	return i;
      }
    }

    return event_listeners[evt].push (cb) - 1;
  };

  this.removeEventListener = function (evt, token) {
    if (typeof (evt) == "string")
      evt = this.lookupEvent (evt);
    if (evt == null)
      throw new Error ("invalid event");

    if (event_listeners[evt] != null && event_listeners[evt].length > token) {
      event_listeners[evt][token] = null;
    }
  };

  this.emitEvent = function (evt, args) {
    var list = event_listeners[evt];
    if (!list)
      return;
    notifyListenerList (list, args);
  };

  // property change listeners
  this.lookupProperty = function (name) {
    return lookupNamedField (name, "Property");
  };

  this.addPropertyChangeListener = function (dp, cb) {
    if (dp == null)
      wildcard_listeners.push (cb);
    else {
	if (propertychange_listeners[dp] == null)
	  propertychange_listeners[dp] = [];
	propertychange_listeners[dp].push (cb);
    }
  };

  this.removePropertyChangeListener = function (dp, cb) {
    if (dp == null) {
      for (var i = 0; i < wildcard_listeners.length; i ++) {
	if (wildcard_listeners[i] == cb) {
	  wildcard_listeners.remove (i);
	  break;
	}
      }
    }
    else if (propertychange_listeners[dp] != null) {
      for (var i = 0; i < propertychange_listeners[dp].length; i ++) {
	if ((propertychange_listeners[dp])[i] == cb) {
	  propertychange_listeners[dp].remove (i);
	  break;
	}
      }
    }
  };

  this.notifyListenersOfPropertyChange = function (args) {
    notifyListenerList (propertychange_listeners[args.property], args);
    notifyListenerList (wildcard_listeners, args);
  };

  function notifyListenerList (list, args) {
    if (list == null)
      return;

    var copy = [];
    for (i = 0; i < list.length; i ++) {
      if (list[i])
	copy.push (list[i]);
    }

    for (i = 0; i < copy.length; i ++)
      copy[i] (this, args);
  };

  // the optional arguments are:
  // arg[0] = parameters
  if (arguments && arguments.length > 0) {
    for (var k in arguments[0]) {
      var prop = this.lookupProperty (k);

      if (prop == null)
	throw new Error ("Illegal property reference in constructor arguments: '" + k + "'.");
      else
	this.setValue(prop, arguments[0][k]);
    }
  }
},

{
  connectHost: function (host) {
    if (this.host)
      throw new Error ("cannot attach a dependency object to two different hosts.");
    this.host = host;

    for (var dpkey in this.properties) {
      var val = this.properties[dpkey];
      if (val && val.connectHost)
	val.connectHost (host);
    }

    var logicalChildren = this.getLogicalChildren ();
    if (logicalChildren && logicalChildren.isSubclass (Collection)) {
      for (var i = 0; i < logicalChildren.count; i ++) {
	var child = logicalChildren.getItemAt(i);
	if (child && child.connectHost)
	  child.connectHost (host);
      }
    }

    // we delay this until we're connected because some firelight objects need a
    // host to do their work (GradientBrushes come to mind).
    this.initializeBoundProperties ();
  },

  disconnectHost: function () {
    this.host = null;

    for (var dpkey in this.properties) {
      var val = this.properties[dpkey];
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

  setValue: logExceptions (function (dp, new_value) {
    if (!dp || !(dp instanceof DependencyProperty))
      throw new Error ("setValue requires valid DependencyProperty");

    if (typeof new_value == "undefined")
      throw new Error ("setValue(" + dp + ") passed an undefined value");

    //if (dp.readonly) throw new "Attempting to set a value on read-only property '" + dp.name + "'";
    if (!this.properties)
      throw new Error ();
    var old_value = this.properties[dp.key];

    var propertyType = dp.resolvePropertyType ();
    if (!propertyType) throw "unable to resolve property type for " + dp;
    if (propertyType == String) {
      if (typeof (new_value) != "string")
	throw "property " + dp + " requires a string value";
      this.properties[dp.key] = new_value;
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
      // XXX punt here, not sure how to deal with opera's lack of __proto__ and therefore failure of isSubclass.
      // throw new Error ("DependencyProperty '" + dp + "' lacks a coerceValue method, and value '" + new_value + "' is not the registered type.");
      this.properties[dp.key] = new_value;

    if (old_value != new_value || (dp.metadata && dp.metadata.alwaysNotify)) {
      var args = { "property" : dp,
		   oldValue: old_value,
		   newValue: this.properties[dp.key] };

      this.onPropertyChanged (args);
      if (dp.metadata && dp.metadata.propertyChangedHandler)
	dp.metadata.propertyChangedHandler.apply (this, [args]);
	this.notifyListenersOfPropertyChange (args);
    }
  }),

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
    var type = this.type;
    while (type) {
//      Trace.debug ("isSubclass (" + proto + ", " + type.prototype + ")");
      if (type == type_proto)
	return true;
      type = type.type;
    }
    return false;
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
  },

  bindProperty: function (bound_dp) {
    var dp_type = bound_dp.resolvePropertyType();

    if ("SvgPropertyValueProperty" in dp_type) {
      // this dependency property applies its value into an SVG
      // attribute.  we add a property change listener on this
      // internal DP, and update the peer listed in the metadata
      // (default is this.svgPeer)
      var peer = bound_dp.metadata.svgPeer ? bound_dp.metadata.svgPeer : "svgPeer";
      var that = this;
      var obj = this.getValue(bound_dp);

      var svgAttributeListener = function (sender, args) {
	if (that["update"+bound_dp.name]) {
	  that["update"+bound_dp.name] ();
	}
	else if (that[peer]) {
	  that[peer].setAttributeNS (bound_dp.metadata.svgAttributeNS || null,
				     bound_dp.metadata.svgAttribute, args.newValue);
	}
      };

      if (obj) {
	obj.addPropertyChangeListener (dp_type.SvgPropertyValueProperty, svgAttributeListener);
	obj.computePropertyValue(); // kick off the machinery for the initial value
      }

      this.addPropertyChangeListener (bound_dp, function (sender, args) {
					if (args.oldValue)
					  args.oldValue.removePropertyChangeListener (dp_type.SvgPropertyValueProperty, svgAttributeListener);
					if (args.newValue) {
					  args.newValue.addPropertyChangeListener (dp_type.SvgPropertyValueProperty, svgAttributeListener);
					  args.newValue.computePropertyValue(); // kick off the machinery for the initial value
					}
				      });
    }
    else {
      var peer = bound_dp.metadata.svgPeer ? bound_dp.metadata.svgPeer : "svgPeer";
      var that = this;

      function updateBoundPropertyFromPrimitiveValue (bound_dp, value) {
        if (bound_dp.metadata.cssAttribute)
	  that[peer].style[bound_dp.metadata.cssAttribute] = value.toString();
	else if (bound_dp.metadata.svgAttribute) {
	  if (that[peer]) {
	    that[peer].setAttributeNS (bound_dp.metadata.svgAttributeNS || null,
				       bound_dp.metadata.svgAttribute, value);
	  }
	}
	else
	  throw new Error ("not sure what to do with this primitive type thingy here.");
      };

      // we assume that it's a primitive type, so we create a binding which is updated when the property is changed.
      this.addPropertyChangeListener(bound_dp,
				     function (sender, args) {
				       updateBoundPropertyFromPrimitiveValue (bound_dp, args.newValue);
				     });


      if (this.properties[bound_dp.key])
	  updateBoundPropertyFromPrimitiveValue (bound_dp, this.properties[bound_dp.key]);
    }
  },

  initializeBoundProperties: function () {
    for (var v in this) {
      if (v.length - v.lastIndexOf ("Property") == "Property".length) {
	var dp = this[v];
	if (dp.metadata && (dp.metadata.svgAttribute || dp.metadata.cssAttribute))
	  this.bindProperty (dp);
      }
    }
  }
});

DependencyProperties.register (DependencyObject, "Name",
			       { propertyType: String });

