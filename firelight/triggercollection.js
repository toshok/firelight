function TriggerCollection ()
{
  Collection.apply (this, arguments);
}

TriggerCollection.prototype = $.extend(new Collection(), {
  getLogicalChildren: function () {
    return this;
  },

  toString: function () {
    return "TriggerCollection";
  }
});

Types.registerType ("System.Windows", TriggerCollection);
