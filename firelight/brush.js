RegisterType ("System.Windows.Media", // namespace
	      "Brush",                // type name
	      DependencyObject,       // parent type
	      null,
	      {
		coerceValueToType: coerceValueToBrush
	      });

DependencyProperties.register (Brush, "SvgPropertyValue",
			       { defaultValue: "",
				 alwaysNotify: true });
