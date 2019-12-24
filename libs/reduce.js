Array.prototype.reduce = function() {
  const arr = this
  const length = arr.length
  if (arguments[0] && typeof arguments[0] === 'function') {
    const fn = arguments[0]
    let value = arguments[1] ? arguments[1] : arr[0]
    const startIndex = arguments[1] ? 0 : 1
    for (let i = startIndex; i < length; i++) {
      value = fn(value, arr[i], i, arr)
    }
    return value
  } else {
    throw new TypeError('err')
  }
}