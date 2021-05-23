"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeMap = exports.arrayToObject = exports.awaitHelper = exports.Logger = exports.photinia = void 0;
const chalk_1 = require("chalk");
const os = require("os");
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
function mergeMap(map1, map2) {
    const arr = [...map1];
    arr.push(...map2);
    return new Map(arr);
}
exports.mergeMap = mergeMap;
