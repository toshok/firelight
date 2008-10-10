var Types = function () {
  // we simulate namespaces with associative arrays
  function registerNamespace (ns) {
	var nss = ns.split('.');
	var o = Types;
	for (var i = 0; i < nss.length; i ++) {
	    if (!(nss[i] in o)) {
//		Trace.debug ("creating " + o + "." + nss[i]);
		o[nss[i]] = {};
	    }
	    o = o[nss[i]];
	}
	return o;
  };

  return {
    lookupNamespace: function (ns) {
      var nss = ns.split('.');
      var o = Types;
      for (var i = 0; i < nss.length; i ++) {
	if (!(nss[i] in o))
	  return null; // the namespace hasn't had any types
	// registered in it.
	o = o[nss[i]];
      }
      return o;
    },

    registerType: function (ns, t) {
      var nsobj = registerNamespace (ns);
      if (!t.typeName) throw new Error ("could not determine type name to register");
      nsobj[t.typeName] = t;
    }
  };
} ();

var XamlTypeResolver = function () {
    var maps = {};
    return {
	addNamespaceMap: function (xmlns, ns) {
	  if (!maps[xmlns]) {
	    maps[xmlns] = [];
	  }
	  maps[xmlns].push (ns);
	},

	resolveQualifiedType: function (qualifiedTypeName) {
//	  Trace.debug ("resolveQualifiedType (" + qualifiedTypeName + ")");
	  var dot = qualifiedTypeName.lastIndexOf('.');
	  if (dot == -1) throw new Error ("you must specify a fully qualified type name");

	  var ns = qualifiedTypeName.substring (0, dot);
	  var typeName = qualifiedTypeName.substring (dot+1);

	  var t = null;
	  var nsobj = Types.lookupNamespace (ns);
	  if (nsobj && typeName in nsobj) {
	    t = nsobj[typeName];
	  }

	  if (!t) throw new Error ("unable to resolve type '" + qualifiedTypeName + "'");
	  return t;
	},

	resolveType: function (nodename, namespace) {
	  if (typeof (namespace) == "undefined")
	    namespace = FirelightConsts.XAMLns;

	  var ns_list = maps[namespace];
	  if (!ns_list) throw new Error ("unable to locate mapping for xmlns '" + namespace + "'");

	  var t = null;
	  for (var i = 0; i < ns_list.length; i ++) {
	    var ns = ns_list[i];
	    var nsobj = Types.lookupNamespace (ns);
	    if (nsobj && nodename in nsobj) {
	      t = nsobj[nodename];
		break;
	      }
	  }
	  if (!t) throw new Error ("unable to resolve type '" + nodename + "' in xmlns '" + namespace + "'");
	  return t;
	}
    };
} ();

XamlTypeResolver.addNamespaceMap (FirelightConsts.XAMLns, "System.Windows");
XamlTypeResolver.addNamespaceMap (FirelightConsts.XAMLns, "System.Windows.Controls");
XamlTypeResolver.addNamespaceMap (FirelightConsts.XAMLns, "System.Windows.Documents");
XamlTypeResolver.addNamespaceMap (FirelightConsts.XAMLns, "System.Windows.Media");
XamlTypeResolver.addNamespaceMap (FirelightConsts.XAMLns, "System.Windows.Media.Animation");
XamlTypeResolver.addNamespaceMap (FirelightConsts.XAMLns, "System.Windows.Media.Effects");
XamlTypeResolver.addNamespaceMap (FirelightConsts.XAMLns, "System.Windows.Shapes");
// XXX more here I'm sure
