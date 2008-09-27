function Inline ()
{
  DependencyObject.apply (this, arguments);
}

Inline.prototype = $.extend(new DependencyObject(), {
  contentProperty: "Text",

  toString: function () {
    return "Run";
  }

});

Types.registerType ("System.Windows.Documents", Inline);
