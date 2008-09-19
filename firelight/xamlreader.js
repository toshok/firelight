var XamlReader = {

    loadFromUrl: function (url, callback) {
	function dataLoaded (data, textStatus) {
	    console.log ("dataLoaded, textStatus = " + textStatus + ", data = " + data);
	    callback (XamlReader.loadFromNode (data.documentElement));
	}
	jQuery.get (url, {}, dataLoaded, "xml");
    },

    loadFromString: function (string) {
	throw "XamlReader.loadFromString not implemented";
    },

    loadFromNode: function (xmlNode) {
	return this.createElementFromXmlNode (xmlNode);
    },

    createElementFromXmlNode: function (xmlNode) {

	console.log ("creating xaml node from xml node " + xmlNode.nodeName);

	// first figure out the correct type for the node
	if (xmlNode.localName.indexOf ('.') != -1)
	    throw "invalid syntax.  '.' can only be used to specify XAML property elements.";

	// x:Class overrides the builtin type for the element (we should
	// probably check if it's a subclass of the localName's type?)
	var nodeTypeName = xmlNode.getAttributeNodeNS ("http://schemas.microsoft.com/winfx/2006/xaml", "Class");
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
	var nodeName = xmlNode.getAttributeNodeNS ("http://schemas.microsoft.com/winfx/2006/xaml", "Name");
	if (nodeName)
	    nodeName = nodeName.value;

	var node = new nodeType();

	if (nodeName) node.name = nodeName;

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
	    if (attr.nodeName.indexOf ('.') != -1) {
		// XXX it's an attached property, look it up based on the class
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
	console.log (xmlNode.nodeName + " children = " + xmlNode.childNodes.length);
	var i = 0;
	for (var n = xmlNode.firstChild; n; n = n.nextSibling) {
	    console.log (xmlNode.nodeName + " child[" + i + "] = " + n.nodeName);
	    i++;
	    if (n.nodeName == "#comment") {
		// ignore
	    }
	    else if (n.nodeName == "#text") {
		// handle text someplace else
	    }
	    else {
		//console.log ("child element " + n.nodeName);
		var dot = n.nodeName.indexOf ('.');
		if (dot != -1) {
		    //console.log ("    property element");
		    // it's a property element.

		    // XXX this code assumes there's an xml subtree rooted at
		    // the first element child of the propertyElement node
		    // This will break for:
		    //
		    // <Canvas.Children>
		    //   <child1>
		    //   <child2>
		    // </Canvas.Children>
		    //
		    // but we punt on that here, as there's no reason to use
		    // that syntax anyway, and there should be a workaround for
		    // other cases (inserting a <UIElementCollection> between
		    // <Canvas.Children> and <child#> for instance.)
		    //
		    var pn = n.firstChild;
		    while (pn && pn.nodeName =="#text")
			pn = pn.nextSibling;

		    if (pn) {
			var propertyName = n.localName.substring (dot+1);
			var propertyNode = this.createElementFromXmlNode (pn);

			var dp = node.lookupProperty (propertyName);
			if (!dp)
			    throw new Error ("unable to find property '" +
					     propertyName +
					     "' on element '" +
					     nodeTypeName + "'");

			node.setValue (dp, propertyNode);
		    }
		}
		else {
		    console.log ("    child element " + n.nodeName);
		    // it's a child element
		    var childNode = this.createElementFromXmlNode (n);
		    node.addChild (childNode);
		}
	    }
	}

	return node;
    }
};
