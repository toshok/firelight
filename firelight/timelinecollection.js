function TimelineCollection ()
{
  Collection.apply (this, arguments);
}

TimelineCollection.prototype = $.extend(new Collection(), {

  getLogicalChildren: function () {
    return this;
  },

  toString: function () {
    return "TimelineCollection";
  }
});

Types.registerType ("System.Windows.Media.Animation", TimelineCollection);
