/**
 * myNew方法创建一个对象的实例等效于 js中的new关键字
 * @param {Function} arguments[0] 等效于new关键字后的构造函数
 */
function myNew () {
  // 创建一个空的对象
  let obj = {};
  // 获得构造函数
  let Con = [].shift.call(arguments)
  // 链接到原型
  obj.__proto__ = Con.prototype
  // 绑定 this，执行构造函数
  let result = Con.apply(obj, arguments)
  // 确保 new 出来的是个对象
  return typeof result === 'object' ? result : obj
}