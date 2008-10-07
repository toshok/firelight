
function Binding(target, update_fn) {
  this.target = target;
  this.update_fn = update_fn;
}
Binding.prototype.update = function () {
  this.update_fn.apply (this.target, []);
};
