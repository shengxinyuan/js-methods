/**
 * 不传入第一个参数，那么默认为 window。改变了 this 指向，让新的对象可以执行该函数。给新的对象添加一个函数，然后在执行完以后删除
 * @param {object} cont 要绑定的obj
 */
Function.prototype.myBind = function (context) {
  var _this = this
  var args = [...arguments].slice(1)
  return function F () {
    if (this instanceof F) {
      return new _this(...args, ...arguments)
    }
    return _this.apply(context, args.concat(...arguments))
  }
}
