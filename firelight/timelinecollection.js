RegisterType ("System.Windows.Media.Animation", "TimelineCollection",
	      Collection, null,
{
  elementType: Timeline,

  getLogicalChildren: function () {
    return this;
  }
});
