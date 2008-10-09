RegisterType ("System.Windows.Media.Animation", // namespace
	      "BeginStoryboard",                // type name
	      TriggerAction,                    // parent type
	      null,
{
  contentProperty: "Storyboard",

  performAction: function () {
    var storyboard = this.storyboard;
    if (storyboard)
      storyboard.start();
  }
});

DependencyProperties.register (BeginStoryboard, "Storyboard",
			       { propertyType: Storyboard });
