'use strict';
exports.__esModule = true;
exports.detectConfig = void 0;
var os = require('os');
function detectConfig(callback) {
    Promise.resolve()
        .then(function () {
            return require(os.homedir() + '/.photiniarc.js');
        })
        .then(function (module) {
            return callback(null, module);
        })
        ['catch'](function (err) {
            return callback(err);
        });
}
exports.detectConfig = detectConfig;
