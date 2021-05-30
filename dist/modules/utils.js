"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.mergeObj = exports.mergeMap = exports.arrayToObject = exports.awaitHelper = exports.preProcess = exports.photinia = void 0;
const chalk_1 = require("chalk");
const os = require("os");
const path_1 = require("path");
const photinia = `${os.homedir()}/.config/photinia`;
exports.photinia = photinia;
// await帮助函数，帮助捕获异常
function awaitHelper(promise) {
    return promise.then((res) => [null, res]).catch((err) => [err, null]);
}
exports.awaitHelper = awaitHelper;
// 转换二维数组至对象
function arrayToObject(arr) {
    return Object.fromEntries(arr.map((val) => {
        const splitedVal = val.split('---');
        return [splitedVal[0].trim(), splitedVal[1].trim()];
    }));
}
exports.arrayToObject = arrayToObject;
// 日志打印 -- 模块
const Logger = {
    err: (msg) => console.log(`${chalk_1.whiteBright.bgRed(' ERROR ')} ${msg}`),
    warn: (msg) => console.log(`${chalk_1.whiteBright.bgRed(' WARN ')} ${msg}`),
    info: (msg) => console.log(`${chalk_1.whiteBright.bgBlue(' INFO ')} ${msg}`),
    done: (msg) => console.log(`${chalk_1.whiteBright.bgGreen(' DONE ')} ${msg}`),
    upd: (msg) => console.log(`${chalk_1.whiteBright.bgYellow(' UPDATE ')} ${msg}`),
    debug: (msg) => console.log(`${chalk_1.whiteBright.bgGray('DEBUG')}`, msg),
    newLine: (lines) => console.log('\n'.repeat(lines - 1)),
    throw: (msg) => {
        throw new Error(msg);
    },
};
exports.Logger = Logger;
// 合并Map
function mergeMap(map1, map2) {
    const arr = [...map1];
    arr.push(...map2);
    return new Map(arr);
}
exports.mergeMap = mergeMap;
// 合并对象
const mergeObj = (obj1, obj2) => (Object.assign(Object.assign({}, obj1), obj2));
exports.mergeObj = mergeObj;
// 文件映射列表预处理函数
function preProcess(template) {
    return new Map([...template.fileMap].map((val) => {
        return [path_1.join(template.repo, val[0]), val[1]];
    }));
}
exports.preProcess = preProcess;
//# sourceMappingURL=utils.js.map