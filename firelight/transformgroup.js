RegisterType ("System.Windows.Media", "TransformGroup",
	      Transform,
function ()
{
  var that = this;
  this.children.addCollectionChangeHandler (function (args) {
					      that.computePropertyValue();
					    });

},

{
  contentProperty: "Children",

  computePropertyValue: function () {
    var str = "";
    var children = this.children;
    for (var i = 0; i < children.count; i ++)
      str += children.getItemAt (i).computePropertyValue();

    this.svgPropertyValue = str;
  }
});

DependencyProperties.register (TransformGroup, "Children",
			       { defaultValue: function () { return new TransformCollection(); },
				 propertyType: TransformCollection });
