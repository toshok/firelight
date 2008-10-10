RegisterType ("System.Windows.Media.Effects", "BitmapEffect",
	      DependencyObject/*WPF has Animatable here */, null,
{
});

DependencyProperties.register (BitmapEffect, "SvgPropertyValue",
			       { defaultValue: "",
				 alwaysNotify: true });
