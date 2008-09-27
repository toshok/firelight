function InlineCollection ()
{
  Collection.apply (this, arguments);
}

InlineCollection.prototype = $.extend(new Collection(), {
  toString: function () {
    return "InlineCollection";
  }
});

Types.registerType ("System.Windows.Documents", InlineCollection);
