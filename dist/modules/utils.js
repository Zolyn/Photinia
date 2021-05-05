"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk_1 = require("chalk");
// 日志打印 -- 模块
const Logger = {
    err: (msg) => console.log(`${chalk_1.whiteBright.bgRed(' ERROR ')} ${msg}`),
    warn: (msg) => console.log(`${chalk_1.whiteBright.bgRed(' WARN ')} ${msg}`),
    info: (msg) => console.log(`${chalk_1.whiteBright.bgBlue(' INFO ')} ${msg}`),
    done: (msg) => console.log(`${chalk_1.whiteBright.bgGreen(' DONE ')} ${msg}`),
    upd: (msg) => console.log(`${chalk_1.whiteBright.bgYellow(' UPDATE ')} ${msg}`),
    debug: (msg) => console.log(`${chalk_1.whiteBright.bgGray('DEBUG')}`, msg),
    newLine: (lines) => console.log('\n'.repeat(lines)),
    cls: () => console.clear(),
    str: {
        err: (msg) => `${chalk_1.whiteBright.bgRed(' ERROR ')} ${msg}`,
        warn: (msg) => `${chalk_1.whiteBright.bgRed(' WARN ')} ${msg}`,
        info: (msg) => `${chalk_1.whiteBright.bgBlue(' INFO ')} ${msg}`,
        done: (msg) => `${chalk_1.whiteBright.bgGreen(' DONE ')} ${msg}`,
        upd: (msg) => `${chalk_1.whiteBright.bgYellow(' UPDATE ')} ${msg}`,
    },
};
exports.Logger = Logger;
