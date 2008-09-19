function TransformGroup ()
{
    Transform.apply (this, arguments);
}
TransformGroup.prototype = $.extend(new Transform(), {

    contentProperty: "Children",

    toString: function () {
	return "TransformGroup";
    },

    applyToPeer: function (host, peer, property) {
	var that = this;

	this.children.addCollectionChangeHandler (function (args) {
	    that.appliedToPeer.setAttributeNS (null, "transform", that.computePropertyValue());
	});

	Transform.prototype.applyToPeer.apply (this, arguments);
    },

    computePropertyValue: function () {
	var str = "";
	var children = this.children;
	for (var i = 0; i < children.count; i ++)
	    str += children.getItemAt (i).computePropertyValue();

	return str;
    }
});

Types.registerType ("System.Windows.Media", TransformGroup);

DependencyProperties.register (TransformGroup, "Children",
			       { defaultValue: function () { return new TransformCollection(); },
				 propertyType: TransformCollection });
