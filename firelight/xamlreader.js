var XamlReader = {

  loadFromUrl: function (url, callback) {
    function dataLoaded (data, textStatus) {
      console.log ("dataLoaded, textStatus = " + textStatus + ", data = " + data);
      callback (XamlReader.loadFromNode (data.documentElement));
    }
    jQuery.get (url, {}, dataLoaded, "xml");
  },

  loadFromNode: function (xmlNode) {
    return this.createElementFromXmlNode (xmlNode);
  },

  createElementFromXmlNode: function (xmlNode) {
    if (xmlNode.localName.indexOf ('.') != -1) throw "invalid syntax.  '.' can only be used to specify XAML property elements.";

    var nodeTypeName = xmlNode.getAttributeNodeNS ("http://schemas.microsoft.com/winfx/2006/xaml", "Class");
    var nodeType = nodeTypeName ? XamlTypeResolver.resolveQualifiedType (nodeTypeName.value) 
                                : XamlTypeResolver.resolveType (xmlNode.localName, xmlNode.namespaceURI);

    var nodeName = xmlNode.getAttributeNodeNS ("http://schemas.microsoft.com/winfx/2006/xaml", "Name");
    if (nodeName)
      nodeName = nodeName.value;

    var node = new nodeType();

    if (nodeName) node.name = nodeName;

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

      console.log (xmlNode.attributes[a].nodeName);
    }
  },
};
