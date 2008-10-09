RegisterType ("System.Windows.Media", "Transform",
	      DependencyObject, null,
{
});

DependencyProperties.register (Transform, "SvgPropertyValue",
			       { defaultValue: "",
				 alwaysNotify: true });

//Types.registerType ("System.Windows.Media", MatrixTransform);
