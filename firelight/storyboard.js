function Storyboard ()
{
  Timeline.apply (this, arguments);

  this.running = false;
}

Storyboard.prototype = $.extend(new Timeline(), {
  contentProperty: "Children",

  begin: function () {
  },

  toString: function () {
    return "Storyboard";
  }
});

DependencyProperties.registerAttached (Storyboard, "TargetName",
				       { propertyType: String });
DependencyProperties.registerAttached (Storyboard, "TargetProperty",
				       { propertyType: String });

DependencyProperties.register (Storyboard, "Children",
			       { propertyType: TimelineCollection,
				 defaultValue: function () { return new TimelineCollection (); }
			       });

Types.registerType ("System.Windows.Media.Animation", Storyboard);
