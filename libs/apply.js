/**
 * 不传入第一个参数，那么默认为 window。改变了 this 指向，让新的对象可以执行该函数。给新的对象添加一个函数，然后在执行完以后删除
 * @param {object} cont 要绑定的obj
 */
Function.prototype.myApply = function (cont, args) {
  var context = cont || window
  context.fn = this
  var res;
  if (args) {
    res = context.fn(...args)
  } else {
    res = context.fn()
  }
  delete context.fn
  return res
}