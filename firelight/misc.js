// ignore firebug stuff on non-firebug browsers
if (typeof (window.console) == "undefined") {
    var console = {
	log: function (str) { }
    };

    window.console = console;
}

var Trace = {
  DEBUG: 1,
  ERROR: 2,

  level: this.ERROR,

  debug: function (str) {
    if (this.level & this.DEBUG)
      console.log ("DEBUG: " + str);
  },

  error: function (str) {
    if (this.level & this.ERROR)
      console.log ("ERROR: " + str);
  }
};

/* the next two methods (printStackTrace and logExceptions) come from
   http://blog.redinnovation.com/2008/08/19/catching-silent-javascript-exceptions-with-a-function-decorator/
*/
function printStackTrace(e) {
    var msg = e.name + ":" + e.message;

    if (e.fileName) {
	msg += " at " + e.fileName + ":" + e.lineNumber;
    }
    Trace.error (msg);

    if (e.stack) {
	// Extract Firefox stack information. This tells how you ended up
	// to the exception in the first place. I didn't find
	// instructions how to parse this stuff.
	Trace.error (e.stack);
    }
}

function logExceptions(func) {
    var orignal = func;

    decorated = function() {
	try {
	  return orignal.apply(this, arguments);
	} catch(exception) {
	  printStackTrace(exception);
	  throw exception;
	}
    };

    return decorated;
}

var getDefId = function () {
    var defId = 0;
    return function () { return "defs" + (defId ++); };
} ();


// this little bit adds a "name" field on functions to browser
// implementations that don't provide it (i.e. opera)
var v = function () {
    function bar () { }
    if (!("name" in bar)) {
	Function.prototype.__defineGetter__ ("name",
					     function () {
						 var n = (/\W*function\s+([\w\$]+)\s*\(/.exec(this.toString()));
						 if (!n) return null;
						 return n[1];
					     });
    }
} ();


// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function format (fmt) {
  if (arguments.length == 0) return null;
  for (var i = 1; i < arguments.length; i ++)
    fmt = fmt.replace ("%"+(i-1), arguments[i]);
  return fmt;
}

function parse2Hex (str) {
  var hex = "0123456789abcdef";

  return hex.indexOf (str.charCodeAt (0)) * 16 + hex.indexOf (str.charCodeAt(1));
}

function parseColor (str)
{
  var n = (/rgb(a?)\s*\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+))?\)/.exec(str));
  if (n) {
    if (n[1] == "a" && !n[5])
      throw new Error ("rgba colors require an alpha value");
    else if (n[1] == "" && n[5])
      throw new Error ("rgb colors don't have an alpha value");

    var c = {
      r: Math.max (Math.min (parseInt (n[2]), 255), 0),
      g: Math.max (Math.min (parseInt (n[3]), 255), 0),
      b: Math.max (Math.min (parseInt (n[4]), 255), 0),
    };
    if (n[5])
      c.a = Math.max (Math.min (parseInt (n[5]), 255), 0);
    else
      c.a = 255;
    return c;
  }

  var n = (/#([a-zA-Z0-9]{2,})([a-zA-Z0-9]{2,})([a-zA-Z0-9]{2,})(?:([a-zA-Z0-9]{2,}))/.exec(str));
  if (n) {
    var c = {
      r: parse2Hex (n[2]),
      g: parse2Hex (n[2]),
      b: parse2Hex (n[2]),
    };
    if (n[5])
      c.a = parse2Hex (n[5]);
    else
      c.a = 255;
    return c;
  }

  return null;
}

function RegisterType (namespace, typeName, parentType, initFunc, prototypeStuff) {
  var ctor = function () {
    if (parentType) parentType.apply (this, arguments);
    if (initFunc) initFunc.apply (this, arguments);
    this.type = ctor.prototype;
  }
  ctor.typeName = typeName;
  ctor.prototype = $.extend (parentType ? new parentType() : {}, prototypeStuff);
  ctor.prototype.toString = function () { return typeName; };

  // XXX remove this at some point soon once all the DP registration and usage of types is fully qualified
  window[typeName] = ctor;

  logExceptions (Types.registerType (namespace, ctor, typeName));
}