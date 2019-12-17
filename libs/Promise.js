const PENDING = 'pengding';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

function MyPromise(fn) {
  let _this = this;
  _this.currentState = PENDING;
  _this.value = undefined;
  _this.reason = undefined;
  _this.resolvedCallBacks = [];
  _this.rejectedCallBacks = [];
  _this.resolve = function(value) {
    if (value instanceof MyPromise) {
      return value.then(_this.resolve, _this.reject)
    }
    if (_this.currentState === PENDING) {
      _this.currentState = RESOLVED;
      _this.value = value;
      _this.resolvedCallBacks.forEach(fn => fn());
    }
  }
  _this.reject = function(reason) {
    if (_this.currentState === PENDING) {
      _this.currentState = REJECTED;
      _this.reason = reason;
      _this.rejectedCallBacks.forEach(fn => fn());
    }
  }
  try {
    fn(_this.resolve, _this.reject);
  } catch (error) {
    _this.reject(error)
  }
}

MyPromise.prototype.then = function() {

}

MyPromise.prototype.then = function (onResolved, onRejected) {
  var self = this;
  var promise2;
  onResolved = typeof onResolved === 'function' ? onResolved : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : r => {throw(r)};

  if (self.currentState === RESOLVED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === REJECTED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === PENDING) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      self.resolvedCallbacks.push(function () {
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });

      self.rejectedCallbacks.push(function () {
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });
    }));
  }
};

function resolutionProcedure(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError("Error"));
  }
  if (x instanceof MyPromise) {
    if (x.currentState === PENDING) {
      x.then(function (value) {
        resolutionProcedure(promise2, value, resolve, reject);
      }, reject);
    } else {
      x.then(resolve, reject);
    }
    return;
  }
  let called = false;
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolutionProcedure(promise2, y, resolve, reject);
          },
          e => {
            if (called) return;
            called = true;
            reject(e);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}