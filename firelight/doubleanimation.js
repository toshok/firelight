function DoubleAnimation ()
{
  Timeline.apply (this, arguments);
}

DoubleAnimation.prototype = $.extend(new Timeline(), {
  toString: function () {
    return "DoubleAnimation";
  },

  resolve: function () {
    var targetName = Storyboard.getTargetName (this);
    if (!targetName)
      throw new Error ("DoubleAnimation doesn't have a Storyboard.TargetName property");

    // XXX this should walk back up the logical tree and findName there instead of the root.
    this.targetObject = this.host.rootVisual.findName (targetName);
    if (!this.targetObject)
      throw new Error ("DoubleAnimation unable to find object named '" + targetName + "'.");

    var targetPropertyName = Storyboard.getTargetProperty(this);
    if (!targetName)
      throw new Error ("DoubleAnimation doesn't have a Storyboard.TargetProperty property");

    this.targetProperty = this.targetObject.lookupProperty (targetPropertyName);
    if (!this.targetProperty)
      throw new Error ("DoubleAnimation unable to find property named '" + targetProperty + "'.");
  },

  updateFromParentTime: function (parentTime) {
    Timeline.prototype.updateFromParentTime.apply (this, arguments);

    var localTime = this.localTime;
    var beginTime = this.beginTime.timeSpan;
    var duration = this.computedDuration;

    if (duration.kind != "timespan")
      throw new Error ("DoubleAnimation computed duration doesn't correspond to a timespan");

    var percent = (localTime - beginTime) / duration.timeSpan;

    var value = this.from + percent * (this.to - this.from);

    //console.log (" -> setting " + targetName + "." + targetPropertyName + " = " + value);
    this.targetObject.setValue (this.targetProperty, value);
  }

});

DependencyProperties.register (DoubleAnimation, "By",
			       { propertyType: Number });
DependencyProperties.register (DoubleAnimation, "From",
			       { propertyType: Number });
DependencyProperties.register (DoubleAnimation, "To",
			       { propertyType: Number });

Types.registerType ("System.Windows.Media.Animation", DoubleAnimation);
