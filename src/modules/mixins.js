'use strict';
var __assign =
    (this && this.__assign) ||
    function () {
        __assign =
            Object.assign ||
            function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                }
                return t;
            };
        return __assign.apply(this, arguments);
    };
exports.__esModule = true;
exports.mixinArr = exports.mixinObj = void 0;
function mixinArr(arr, mixins) {
    arr.unshift.apply(arr, mixins);
    return arr;
}
exports.mixinArr = mixinArr;
var mixinObj = function (obj, mixins) {
    return __assign(__assign({}, obj), mixins);
};
exports.mixinObj = mixinObj;
