"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mixinArr = exports.mixinObj = void 0;
function mixinArr(arr, mixins) {
    arr.unshift(...mixins);
    return arr;
}
exports.mixinArr = mixinArr;
const mixinObj = (obj, mixins) => (Object.assign(Object.assign({}, obj), mixins));
exports.mixinObj = mixinObj;
