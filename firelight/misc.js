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

  level: 0,

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
