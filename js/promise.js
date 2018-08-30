function Promise(fn) {
    this.status = "pending"; // promise的状态 pending/fullfiled/rejected，不可逆转
    this.fn = fn; // 保存promise传入的回调，在then里面执行
}

Promise.prototype.then = function(onFullfilled, onRejected) {
    var self = this;
    // 利用闭包的特性，使得fn执行的时候，还能找到then里面的onFullfilled，并且执行
    var resolve = function(value) {
        // 保证状态不可逆转
        if(self.status === "pending") {
            self.status = "fullfiled";
            onFullfilled(value);
        }
    }
    var reject = function(reason) {
        // 保证状态不可逆转
        if(self.status === "pending") {
            self.status = "rejected";
            onRejected(reason);
        }
    }
    this.fn(resolve, reject);
    return this;
}

new Promise(function(resolve, reject) {
    setTimeout(function() {
        if(Math.random() > 0.5) {
            resolve('fullfiled')
        } else {
            reject('reject');
        }
    }, 1000)
}).then(function(value) {
    console.log(value)
}, function(reason) {
    console.log(reason)
})

