RegisterType ("System.Windows", "LayoutInformation",
	      DependencyObject, null,
{
});

DependencyProperties.registerAttached (LayoutInformation, "LayoutSlot",
				       { propertyType: Rect,
					 coerceValue: coerceValueToRect });
