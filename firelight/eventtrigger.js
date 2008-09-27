function EventTrigger ()
{
  DependencyObject.apply (this, arguments);
}

EventTrigger.prototype = $.extend(new DependencyObject(), {
  contentProperty: "Actions",

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
	this.trigger.runActions ();
      }
    };

    this.svgPeer.addEventListener (domEvent, eventHandler, false);
  },

  runActions: function () {
    var actions = this.actions;
    for (var i = 0; i < actions.count; i ++) {
      var action = actions.getItemAt (i);
      action.run (this.obj);
    }
  }
});

DependencyProperties.register (EventTrigger, "RoutedEvent",
			       { propertyType: String
			       });

DependencyProperties.register (EventTrigger, "Actions",
			       { propertyType: TriggerActionCollection,
				 defaultValue: function () { return new TriggerActionCollection (); }
			       });

Types.registerType ("System.Windows", EventTrigger);
