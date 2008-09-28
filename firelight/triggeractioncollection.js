function TriggerActionCollection ()
{
  Collection.apply (this, arguments);
}

TriggerActionCollection.prototype = $.extend(new Collection(), {
  getLogicalChildren: function () {
    return this;
  },

  toString: function () {
    return "TriggerActionCollection";
  }
});

Types.registerType ("System.Windows", TriggerActionCollection);
