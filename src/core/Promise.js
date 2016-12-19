if (!Promise.prototype.finally) {
    Promise.prototype.finally = function(func) {
        return this
            .then(function(result){
                return Promise
                    .resolve(func())
                    .then(() => result)
            })
            .catch(function(result){
                return Promise
                    .resolve(func())
                    .then(() => Promise.reject(result))
            });
    };
}

if (!Promise.timeout) {
    Promise.timeout = function(time = 0) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };
}

if (!Promise.prototype.timeout) {
    Promise.prototype.timeout = function(time) {
        return this
            .then(function(result){
                return Promise
                    .timeout(time)
                    .then(() => result);
            });
    };
}

export default Promise;
