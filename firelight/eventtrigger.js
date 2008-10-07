function EventTrigger ()
{
  TriggerBase.apply (this, arguments);
}

EventTrigger.prototype = $.extend(new TriggerBase(), {
  toString: function () {
    return "EventTrigger";
  },

  mapRoutedEventToDOMEvent: function (ev) {
    switch (ev) {
      case "MouseMove": return "mousemove";
      case "MouseLeftButtonDown": return "mousedown";
      case "MouseLeftButtonUp": return "mouseup";
//      case "KeyDown":
//      case "KeyUp":
      case "MouseEnter": return "mouseover";
      case "MouseLeave": return "mouseout";
//      case "GotFocus":
//      case "LostFocus":
      default:
	throw new Error ("Unknown event name '" + ev + "'");
    }
  },

  hookupTrigger: function (obj, peer) {
    var domEvent = this.mapRoutedEventToDOMEvent (this.routedEvent);

    this.obj = obj;
    this.svgPeer = peer;

    var eventHandler = {
      trigger: this,

      handleEvent: function (ev) {
	this.trigger.performActions ();
      }
    };

    this.svgPeer.addEventListener (domEvent, eventHandler, false);
  }
});

DependencyProperties.register (EventTrigger, "RoutedEvent",
			       { propertyType: String
			       });

Types.registerType ("System.Windows", EventTrigger);
