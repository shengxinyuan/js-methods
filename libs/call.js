/**
 * 不传入第一个参数，那么默认为 window。改变了 this 指向，让新的对象可以执行该函数。给新的对象添加一个函数，然后在执行完以后删除
 * @param {object} cont 要绑定的obj
 */
Function.prototype.myCall = function (cont) {
  var context = cont || window
  context.fn = this
  var args = [...arguments].slice(1)
  var res = context.fn(...args)
  delete context.fn
  return res
}