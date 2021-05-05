'use strict';
exports.__esModule = true;
exports.Logger = void 0;
var chalk_1 = require('chalk');
// 日志打印 -- 模块
var Logger = {
    err: function (msg) {
        return console.log(chalk_1.whiteBright.bgRed(' ERROR ') + ' ' + msg);
    },
    warn: function (msg) {
        return console.log(chalk_1.whiteBright.bgRed(' WARN ') + ' ' + msg);
    },
    info: function (msg) {
        return console.log(chalk_1.whiteBright.bgBlue(' INFO ') + ' ' + msg);
    },
    done: function (msg) {
        return console.log(chalk_1.whiteBright.bgGreen(' DONE ') + ' ' + msg);
    },
    upd: function (msg) {
        return console.log(chalk_1.whiteBright.bgYellow(' UPDATE ') + ' ' + msg);
    },
    debug: function (msg) {
        return console.log('' + chalk_1.whiteBright.bgGray('DEBUG'), msg);
    },
    newLine: function (lines) {
        return console.log('\n'.repeat(lines));
    },
    cls: function () {
        return console.clear();
    },
    str: {
        err: function (msg) {
            return chalk_1.whiteBright.bgRed(' ERROR ') + ' ' + msg;
        },
        warn: function (msg) {
            return chalk_1.whiteBright.bgRed(' WARN ') + ' ' + msg;
        },
        info: function (msg) {
            return chalk_1.whiteBright.bgBlue(' INFO ') + ' ' + msg;
        },
        done: function (msg) {
            return chalk_1.whiteBright.bgGreen(' DONE ') + ' ' + msg;
        },
        upd: function (msg) {
            return chalk_1.whiteBright.bgYellow(' UPDATE ') + ' ' + msg;
        },
    },
};
exports.Logger = Logger;
