function Trigger ()
{
  TriggerBase.apply (this, arguments);
}

Trigger.prototype = $.extend(new TriggerBase(), {
  toString: function () {
    return "Trigger";
  },

  hookupTrigger: function (obj, peer) {

    var trigger_obj = obj;
    if (this.sourceName) {
      // the trigger doesn't actually refer to this object

      // XXX obj might not be a framework element.  we need to figure
      // out how to get to a FWE so we can findName
      trigger_obj = obj.findName (this.sourceName);
      if (!trigger_obj)
	throw new Error ("no object named '" + this.sourceName + "'");
    }

    var dp = trigger_obj.lookupProperty (this.property);
    if (!dp)
    	throw new Error ("no dependencyproperty named '" + this.property + "'");

    this.obj = obj;
    this.svgPeer = peer;

    var that = this;
    trigger_obj.addPropertyChangeListener (dp,
					   function (sender, args) {
					     if (args.property == dp && args.newValue.toString() == that.value)
					       that.performActions ();
					   });
  }
});

DependencyProperties.register (Trigger, "SourceName",
			       { propertyType: String,
				 defaultValue: null
			       });

DependencyProperties.register (Trigger, "Property",
			       { propertyType: String,
				 defaultValue: null
			       });

DependencyProperties.register (Trigger, "Value",
			       { propertyType: String,
				 defaultValue: ""
			       });

Types.registerType ("System.Windows", Trigger);
