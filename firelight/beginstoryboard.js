function BeginStoryboard ()
{
  DependencyObject.apply (this, arguments);
}

BeginStoryboard.prototype = $.extend(new DependencyObject(), {
  contentProperty: "Storyboard",

  toString: function () {
    return "BeginStoryboard";
  }
});

DependencyProperties.register (BeginStoryboard, "Storyboard",
			       { propertyType: Storyboard });

Types.registerType ("System.Windows.Media.Animation", BeginStoryboard);
