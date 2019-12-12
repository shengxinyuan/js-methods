/**
 * 用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上的方法，等效于instanceof运算符
 * @param {any} left 等效instanceof运算符 左边的要检测值
 * @param {any} right 等效instanceof运算符 右边的目标构造函数
 */
function myInstanceof (left, right) {
  var prototype = right.prototype
  left = left.__proto__
  while (true) {
    if (left === null) {
      return false
    }
    if (prototype === left) {
      return true
    }
    left = left.__proto__
  }
}
