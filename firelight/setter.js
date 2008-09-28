function Setter ()
{
  DependencyObject.apply (this, arguments);
}

Setter.prototype = $.extend (new DependencyObject(), {
  toString: function () {
    return "Setter";
  },

  performAction: function (obj) {
    Trace.debug ("i should be setting " + this.targetName + "." + this.property + " = " + this.value);

    var targetObject = obj.findName (this.targetName);
    if (!targetObject)
      throw new Error ("Setter unable to find object named '" + this.targetName + "'.");

    var targetProperty = targetObject.lookupProperty (this.property);
    if (!targetProperty)
      throw new Error ("Setter unable to find property named '" + this.Property + "' on object.");

    targetObject.setValue (targetProperty, this.value);
  }
});

DependencyProperties.register (Setter, "TargetName",
			       { defaultValue: "" });
DependencyProperties.register (Setter, "Property",
			       { defaultValue: "" });
DependencyProperties.register (Setter, "Value",
			       { defaultValue: "" });

Types.registerType ("System.Windows", Setter);
