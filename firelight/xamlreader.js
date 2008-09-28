var XamlReader = {

  loadFromUrl: function (url, callback) {
    jQuery.get (url, {},
		function (data, textStatus) {
		  Trace.debug ("dataLoaded, textStatus = " + textStatus + ", data = " + data);
		  callback (XamlReader.loadFromNode (data.documentElement));
		}, "xml");
  },

  loadFromString: function (string) {
    throw "XamlReader.loadFromString not implemented";
  },

  loadFromNode: function (xmlNode) {
    var namescope = new NameScope();
    var rv = this.createElementFromXmlNode (xmlNode, namescope, true);

    return rv;
  },

  createElementFromXmlNode: function (xmlNode, namescope, top) {

    Trace.debug ("creating xaml node from xml node " + xmlNode.nodeName);

    // first figure out the correct type for the node
    if (xmlNode.localName.indexOf ('.') != -1)
      throw "invalid syntax.  '.' can only be used to specify XAML property elements.";

    // x:Class overrides the builtin type for the element (we should
    // probably check if it's a subclass of the localName's type?)
    var nodeTypeName = xmlNode.getAttributeNodeNS (FirelightConsts.XAMLxns, "Class");
    if (nodeTypeName) nodeTypeName = nodeTypeName.value;

    var nodeType;

    if (nodeTypeName) {
      nodeType = XamlTypeResolver.resolveQualifiedType (nodeTypeName);
    }
    else {
      nodeTypeName = xmlNode.localName;
      nodeType = XamlTypeResolver.resolveType (xmlNode.localName, xmlNode.namespaceURI);
    }

    // deal with x:Name here

    var node = new nodeType();

    if (top)
      NameScope.setNameScope (node, namescope);

    var nodeName = xmlNode.getAttributeNodeNS (FirelightConsts.XAMLxns, "Name");
    if (nodeName) {
      node.name = nodeName.value;
      namescope.registerName (node.name, node);
    }

    // iterate over the all the attribute nodes
    for (var a = 0; a < xmlNode.attributes.length; a++) {
      var attr = xmlNode.attributes[a];

      if (attr.nodeName == "xmlns"
	  || attr.nodeName.substring(0,6) == "xmlns:") {
	continue;
      }

      // ignore namespaced attributes for now at least.  we might be
      // able to ignore them forever if x:Name and x:Class are the
      // only ones we care about.
      if (attr.nodeName.indexOf (':') != -1) {
	continue;
      }

      var dp = null;
      var dot = attr.nodeName.indexOf ('.');
      if (dot != -1) {
	// it's an attached property, we need to look it up on the class mentioned in the nodeName.
	var attached_className = attr.nodeName.substring (0, dot);
	Trace.debug ("attached property.  className = " + attached_className);

	var attached_nodeType = XamlTypeResolver.resolveType (attached_className, xmlNode.namespaceURI);

	if (!attached_nodeType)
	  throw new Error ("could not resolve class " + attached_className + "in context of attached property '" + attr.nodeName + "'.");

	var n = new attached_nodeType();
	dp = n.lookupProperty (attr.nodeName.substring (dot + 1));
      }
      else {
	dp = node.lookupProperty (attr.nodeName);
      }

      if (!dp)
	throw new Error ("unable to find property '" +
			 attr.nodeName +
			 "' on element '" +
			 nodeTypeName + "'");

      node.setValue (dp, attr.value);
    }

    // now iterate over each one of the children of this node
    // recursively
    Trace.debug (xmlNode.nodeName + " children = " + xmlNode.childNodes.length);
    var i = 0;
    for (var n = xmlNode.firstChild; n; n = n.nextSibling) {
      Trace.debug (xmlNode.nodeName + " child[" + i + "] = " + n.nodeName);
      i++;
      if (n.nodeName == "#comment") {
	// ignore
      }
      else if (n.nodeName == "#text") {
	// handle text someplace else
      }
      else {
	//Trace.debug ("child element " + n.nodeName);
	var dot = n.nodeName.indexOf ('.');
	if (dot != -1) {
	  //Trace.debug ("    property element");
	  // it's a property element.

	  var propertyName = n.localName.substring (dot+1);
	  var dp = node.lookupProperty (propertyName);

	  if (!dp)
	    throw new Error ("unable to find property '" +
			     propertyName +
			     "' on element '" +
			     nodeTypeName + "'");


	  var collection =  dp.resolvePropertyType().prototype.isSubclass
			      ? dp.resolvePropertyType().prototype.isSubclass (Collection)
			      : false;

	  var resources =  dp.resolvePropertyType().prototype.isSubclass
			      ? dp.resolvePropertyType().prototype.isSubclass (ResourceDictionary)
			      : false;

	  var more_children_allowed = true;
	  var pn = n.firstChild;
	  while (pn) {
	    // skip text node(s)
	    if (pn.nodeName != "#text") {
	      if (!more_children_allowed)
		throw new Error ("Non-collection property '" + dp + "' cannot have more than one child node");

	      var propertyNode = this.createElementFromXmlNode (pn, namescope, false);

	      if (!collection || dp.resolvePropertyType() == propertyNode.__proto__) {
		node.setValue (dp, propertyNode);
		more_children_allowed = false;
	      }
	      else {
		node.getValue (dp).addChild (propertyNode);
	      }
	    }
	    pn = pn.nextSibling;
	  }
	}
	else {
	  Trace.debug ("    child element " + n.nodeName);
	  // it's a child element
	  var childNode = this.createElementFromXmlNode (n, namescope, false);
	  node.addChild (childNode);
	}
      }
    }

    return node;
  }
};
