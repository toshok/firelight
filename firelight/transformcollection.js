function TransformCollection ()
{
  Collection.apply (this, arguments);
}
TransformCollection.prototype = $.extend(new Collection(), {
  toString: function () {
    return "TransformCollection";
  }
});

Types.registerType ("System.Windows.Media", TransformCollection);
