function LayoutInformation () {
}

DependencyProperties.registerAttached (LayoutInformation, "LayoutSlot",
				       { propertyType: Rect,
					 coerceValue: coerceValueToRect });
