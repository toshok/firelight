function ScaleTransform ()
{
    Transform.apply (this, arguments);
}
ScaleTransform.prototype = $.extend(new Transform(), {
    toString: function () {
	return "ScaleTransform";
    },

    computePropertyValue: function () {
	return "scale(" + this.scaleX + "," + this.scaleY + ")";
    }
});
Types.registerType ("System.Windows.Media", ScaleTransform);

DependencyProperties.register (ScaleTransform, "ScaleX",
			       { defaultValue: 1 });
DependencyProperties.register (ScaleTransform, "ScaleY",
			       { defaultValue: 1 });
