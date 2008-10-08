var EventManager = new function () {
  var events = [];

  function registerEvent (evt) {
    events.push (evt);
  }

  function getKey (ownerType, name) {
    var typeName = ownerType.name;

    if (!typeName) throw "unable to determine type name when registering '" + name + "' property";

    return format ("%0.%1", typeName, name);
  }

  function defineAccessors (evt) {
    // define the XXXEvent getter on the ownerType
    evt.ownerType.prototype.__defineGetter__ (evt.name + "Event", function () { return evt; });
    // and a setter that just throws an exception
    evt.ownerType.prototype.__defineSetter__ (evt.name + "Event", function (val) { throw "You can't overwrite a registered RoutedEvent"; });
    // now put a convenient getter on the constructor so we don't have
    // to put '.prototype' in all references to the DP
    evt.ownerType.__defineGetter__ (evt.name + "Event", function () { return evt; });
  }

  return {
    getRoutedEvents: function () {
      return events;
    },

    registerRoutedEvent: function (ownerType, name, routingStrategy) {
      var evt = new RoutedEvent (getKey (ownerType, name), ownerType, name, routingStrategy);

      registerEvent (evt);

      defineAccessors (evt);
      
      return evt;
    }
  }
};

function RoutedEvent (key, ownerType, name, routingStrategy) {
  this.key = key;
  this.name = name;
  this.ownerType = ownerType;

  if (routingStrategy != "bubble" &&
      routingStrategy != "tunnel" &&
      routingStrategy != "direct")
    throw new Error ("invalid routingStrategy '" + routingStrategy + "'");

  this.routingStrategy = routingStrategy;
}

RoutedEvent.prototype = $.extend (new Object(), {
  toString: function () {
    return this.key;
  }
});
