// we simulate namespaces with associative arrays
function TypesCtor () {
    function registerNamespace (ns) {
	var nss = ns.split('.');
	var o = Types;
	for (var i = 0; i < nss.length; i ++) {
	    if (!(nss[i] in o)) {
		console.log ("creating " + o + "." + nss[i]);
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
	    var typeName = t.name;
	    if (!typeName) throw new Error ("could not determine type name to register");
	    nsobj[typeName] = t;
	}
    };
};

var Types = new TypesCtor();

function XamlTypeResolverCtor () {
    var maps = {};
    return {
	addNamespaceMap: function (xmlns, ns) {
	    if (!maps[xmlns]) {
		maps[xmlns] = [];
	    }
	    maps[xmlns].push (ns);
	},

	resolveQualifiedType: function (qualifiedTypeName) {
	    console.log ("resolveQualifiedType (" + qualifiedTypeName + ")");
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
};

var XamlTypeResolver = new XamlTypeResolverCtor();

XamlTypeResolver.addNamespaceMap ("http://schemas.microsoft.com/winfx/2006/xaml/presentation", "System.Windows");
XamlTypeResolver.addNamespaceMap ("http://schemas.microsoft.com/winfx/2006/xaml/presentation", "System.Windows.Controls");
XamlTypeResolver.addNamespaceMap ("http://schemas.microsoft.com/winfx/2006/xaml/presentation", "System.Windows.Media");
XamlTypeResolver.addNamespaceMap ("http://schemas.microsoft.com/winfx/2006/xaml/presentation", "System.Windows.Media.Animation");
XamlTypeResolver.addNamespaceMap ("http://schemas.microsoft.com/winfx/2006/xaml/presentation", "System.Windows.Shapes");
// XXX more here I'm sure
