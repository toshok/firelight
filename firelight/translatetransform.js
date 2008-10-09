RegisterType ("System.Windows.Media", "TranslateTransform",
	      Transform, null,
{
  computePropertyValue: function () {
    return "translate(" + this.x + "," + this.y + ")";
  }
});

DependencyProperties.register (TranslateTransform, "X",
			       { defaultValue: 0 });
DependencyProperties.register (TranslateTransform, "Y",
			       { defaultValue: 0 });

