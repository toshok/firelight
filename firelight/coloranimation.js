function ColorAnimation ()
{
  Timeline.apply (this, arguments);
}

ColorAnimation.prototype = $.extend(new Timeline(), {
  toString: function () {
    return "ColorAnimation";
  },

  resolve: function () {
    var targetName = Storyboard.getTargetName (this);
    if (!targetName)
      throw new Error ("ColorAnimation doesn't have a Storyboard.TargetName property");

    // XXX this should walk back up the logical tree and findName there instead of the root.
    this.targetObject = this.host.rootVisual.findName (targetName);
    if (!this.targetObject)
      throw new Error ("ColorAnimation unable to find object named '" + targetName + "'.");

    var targetPropertyName = Storyboard.getTargetProperty(this);
    if (!targetName)
      throw new Error ("ColorAnimation doesn't have a Storyboard.TargetProperty property");

    this.targetProperty = this.targetObject.lookupProperty (targetPropertyName);
    if (!this.targetProperty)
      throw new Error ("ColorAnimation unable to find property named '" + targetProperty + "'.");

    // gross, but we need to figure out the rgb values for these colors so we can interpolate them
    var r = document.createElementNS (FirelightConsts.SVGns, "rect");
    r.setAttributeNS (null, "fill", this.from);
    this.resolvedFrom = parseColor (document.defaultView.getComputedStyle (r, null).getPropertyValue("fill"));
    r.setAttributeNS (null, "fill", this.to);
    this.resolvedTo = parseColor (document.defaultView.getComputedStyle (r, null).getPropertyValue("fill"));
  },

  updateFromParentTime: function (parentTime) {
    Timeline.prototype.updateFromParentTime.apply (this, arguments);

    var localTime = this.localTime;
    var beginTime = this.beginTime.timeSpan;
    var duration = this.computedDuration;

    if (duration.kind != "timespan")
      throw new Error ("ColorAnimation computed duration doesn't correspond to a timespan");

    var percent = (localTime - beginTime) / duration.timeSpan;

    if (percent < 1) {
      var new_r = Math.floor (this.resolvedFrom.r + percent * (this.resolvedTo.r - this.resolvedFrom.r));
      var new_g = Math.floor (this.resolvedFrom.g + percent * (this.resolvedTo.g - this.resolvedFrom.g));
      var new_b = Math.floor (this.resolvedFrom.b + percent * (this.resolvedTo.b - this.resolvedFrom.b));
      var new_a = Math.floor (this.resolvedFrom.a + percent * (this.resolvedTo.a - this.resolvedFrom.a));

      this.targetObject.setValue (this.targetProperty, "rgba(" + new_r + ", " + new_g + ", " + new_b + ", " + new_a + ")");
    }
    else /* percent == 1 */ {
      /* this is just a nicety so that the value of the svg property
         will be the actual string that the user set for this.To */

      this.targetObject.setValue (this.targetProperty, this.to);
    }
  }

});

DependencyProperties.register (ColorAnimation, "By",
			       { propertyType: String });
DependencyProperties.register (ColorAnimation, "From",
			       { propertyType: String });
DependencyProperties.register (ColorAnimation, "To",
			       { propertyType: String });

Types.registerType ("System.Windows.Media.Animation", ColorAnimation);
