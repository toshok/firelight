function TranslateTransform ()
{
    Transform.apply (this, arguments);
}
TranslateTransform.prototype = $.extend(new Transform(), {
    toString: function () {
	return "TranslateTransform";
    },

    computePropertyValue: function () {
	return "translate(" + this.x + "," + this.y + ")";
    }
});
Types.registerType ("System.Windows.Media", TranslateTransform);

DependencyProperties.register (TranslateTransform, "X",
			       { defaultValue: 0 });
DependencyProperties.register (TranslateTransform, "Y",
			       { defaultValue: 0 });

