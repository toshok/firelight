RegisterType ("System.Windows", "TriggerActionCollection",
	      Collection, null,
{
  elementType: TriggerAction,
  
  getLogicalChildren: function () {
    return this;
  },
});
