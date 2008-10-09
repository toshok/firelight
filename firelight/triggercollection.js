RegisterType ("System.Windows", "TriggerCollection",
	      Collection, null,
{
  elementType: TriggerBase,

  getLogicalChildren: function () {
    return this;
  }
});
