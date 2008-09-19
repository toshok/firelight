function RotateTransform ()
{
    Transform.apply (this, arguments);
}
RotateTransform.prototype = $.extend(new Transform(), {

    toString: function () {
	return "RotateTransform";
    },

    computePropertyValue: function () {
	return "rotate(" + this.angle + "," + this.centerX + "," + this.centerY + ")";
    }
});
Types.registerType ("System.Windows.Media", RotateTransform);

DependencyProperties.register (RotateTransform, "Angle",
			       { defaultValue: 0 });
DependencyProperties.register (RotateTransform, "CenterX",
			       { defaultValue: 0 });
DependencyProperties.register (RotateTransform, "CenterY",
			       { defaultValue: 0 });

