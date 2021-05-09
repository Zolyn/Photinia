"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mixinMap = void 0;
function mixinMap(arr, mixins) {
    arr.unshift(...mixins);
    return new Map(arr);
}
exports.mixinMap = mixinMap;
