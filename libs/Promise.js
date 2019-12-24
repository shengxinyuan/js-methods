// const PENDING = 'pengding';
// const RESOLVED = 'resolved';
// const REJECTED = 'rejected';

// function MyPromise(fn) {
//   let _this = this;
//   _this.currentState = PENDING;
//   _this.value = undefined;
//   _this.reason = undefined;
//   _this.resolvedCallBacks = [];
//   _this.rejectedCallBacks = [];
//   _this.resolve = function(value) {
//     if (value instanceof MyPromise) {
//       return value.then(_this.resolve, _this.reject)
//     }
//     if (_this.currentState === PENDING) {
//       _this.currentState = RESOLVED;
//       _this.value = value;
//       _this.resolvedCallBacks.forEach(fn => fn());
//     }
//   }
//   _this.reject = function(reason) {
//     if (_this.currentState === PENDING) {
//       _this.currentState = REJECTED;
//       _this.reason = reason;
//       _this.rejectedCallBacks.forEach(fn => fn());
//     }
//   }
//   try {
//     fn(_this.resolve, _this.reject);
//   } catch (error) {
//     _this.reject(error)
//   }
// }

// MyPromise.prototype.then = function (onResolved, onRejected) {
//   var _this = this;
//   var promise2;
//   onResolved = typeof onResolved === 'function' ? onResolved : v => v;
//   onRejected = typeof onRejected === 'function' ? onRejected : r => {throw(r)};

//   if (_this.currentState === RESOLVED) {
//     return (promise2 = new MyPromise(function (resolve, reject) {
//       setTimeout(function () {
//         try {
//           var x = onResolved(_this.value);
//           resolutionProcedure(promise2, x, resolve, reject);
//         } catch (reason) {
//           reject(reason);
//         }
//       });
//     }));
//   }

//   if (_this.currentState === REJECTED) {
//     return (promise2 = new MyPromise(function (resolve, reject) {
//       setTimeout(function () {
//         try {
//           var x = onRejected(_this.value);
//           resolutionProcedure(promise2, x, resolve, reject);
//         } catch (reason) {
//           reject(reason);
//         }
//       });
//     }));
//   }

//   if (_this.currentState === PENDING) {
//     return (promise2 = new MyPromise(function (resolve, reject) {
//       _this.resolvedCallbacks.push(function () {
//         try {
//           var x = onResolved(_this.value);
//           resolutionProcedure(promise2, x, resolve, reject);
//         } catch (r) {
//           reject(r);
//         }
//       });

//       _this.rejectedCallbacks.push(function () {
//         try {
//           var x = onRejected(_this.value);
//           resolutionProcedure(promise2, x, resolve, reject);
//         } catch (r) {
//           reject(r);
//         }
//       });
//     }));
//   }
// };

// function resolutionProcedure(promise2, x, resolve, reject) {
//   if (promise2 === x) {
//     return reject(new TypeError("Error"));
//   }
//   if (x instanceof MyPromise) {
//     if (x.currentState === PENDING) {
//       x.then(function (value) {
//         resolutionProcedure(promise2, value, resolve, reject);
//       }, reject);
//     } else {
//       x.then(resolve, reject);
//     }
//     return;
//   }
//   let called = false;
//   if (x !== null && (typeof x === "object" || typeof x === "function")) {
//     try {
//       let then = x.then;
//       if (typeof then === "function") {
//         then.call(
//           x,
//           y => {
//             if (called) return;
//             called = true;
//             resolutionProcedure(promise2, y, resolve, reject);
//           },
//           e => {
//             if (called) return;
//             called = true;
//             reject(e);
//           }
//         );
//       } else {
//         resolve(x);
//       }
//     } catch (e) {
//       if (called) return;
//       called = true;
//       reject(e);
//     }
//   } else {
//     resolve(x);
//   }
// }

class 实现
const PENDING = 'pengding';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

class MyPromise {
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('111')
    }
    this.value = null
    this.reason = null
    this.status = PENDING
    this.resolvedCallBacks = []
    this.rejectedCallBacks = []
    
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value
        this.status = RESOLVED
      }
    }
    const reject = (resaon) => {
      if (this.status === PENDING) {
        this.resaon = resaon
        this.status = REJECTED
      }
    }

    try {
      fn(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onResolved, onRejected) {
    onResolved = typeof onResolved === 'function' ? onResolved : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : v => {throw v}
    let promise2
    
    if (this.status === RESOLVED) {
      promise2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onResolved(this.value)
            resolvePromise(promise2, x ,resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      })
    }
    if (this.status === REJECTED) {
      promise2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onRejected(this.value)
            resolvePromise(promise2, x ,resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      })
    }
    if (this.status === PENDING) {
      promise2 = new MyPromise((resolve, reject) => {
        this.rejectedCallBacks.push(() => {
          setTimeout(() => {
            try {
              let x = onResolved(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })
        this.rejectedCallBacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })
      })
    }
    return promise2
  }
}

MyPromise.relsolve = function(value) {
  return new MyPromise((resolve, reject) => {
    resolve(value)
  })
}

MyPromise.reject = function(reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason)
  })
}

MyPromise.all = function(promises) {
  if (Array.isArray(promises) ) {
    let arr = [];
    let i = 0;
    return new MyPromise((resolve, reject) => {
      promises.forEach((fn, index) => {
        fn.then(data => {
          arr[index] = data;
          i++;
          if (i == promises.length) {
            resolve(arr)
          }
        }, reject)
      })
    })
  }
}
MyPromise.all = function(list) {
  let i = 0;
  let res = [];
  return new MyPromise((resolve, reject) => {
    list.forEach((val, index) => {
      val.then((data) => {
        res[index] = data;
        i++;
        if (i == list.length) {
          resolve(res)
        }
      }, reject)
    })
  }) 
}


function resolvePromise(promise2, x ,resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('error'))
  }
  let called
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, (x1) => {
          if (called) return
          called = true
          resolvePromise(promise2, x1 ,resolve, reject)
        }, (err) => {
          if (called) return
          called = true
          reject(err)
        })
      } else {
        resolve(x)
      }
    } catch (err) {
      if (called) return
      called = true
      reject(err)
    }
  } else {
    resolve(x)
  }
}

