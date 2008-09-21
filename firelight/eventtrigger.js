function EventTrigger ()
{
  DependencyObject.apply (this, arguments);
}

EventTrigger.prototype = $.extend(new DependencyObject(), {
  contentProperty: "Actions",

  toString: function () {
    return "EventTrigger";
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
