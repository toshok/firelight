RegisterType ("System.Windows", "TriggerBase",
	      DependencyObject, null,
{
  contentProperty: "Actions",

  performActions: function () {
    var actions = this.actions;
    for (var i = 0; i < actions.count; i ++) {
      var action = actions.getItemAt (i);
      action.performAction (this.obj);
    }
  }
});

DependencyProperties.register (TriggerBase, "Actions",
			       { propertyType: TriggerActionCollection,
				 defaultValue: function () { return new TriggerActionCollection (); }
			       });
