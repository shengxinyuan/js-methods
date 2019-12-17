function generator(fn) {
  return (function() {
    var obj = {
      next: 0,
      stop: function() {}
    }
    return {
      next: function() {
        var ret = fn(obj)
        if (ret === undefined) {
          return {
            value: undefined,
            done: true,
          }
        }
        return {
          value: ret,
          done: false,
        }
      }
    }
  })();
}