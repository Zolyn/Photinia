"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importConfig = void 0;
const os = require("os");
function importConfig(callback) {
    Promise.resolve().then(() => require(`${os.homedir()}/.photiniarc.js`)).then((module) => callback(null, module))
        .catch((err) => callback(err));
}
exports.importConfig = importConfig;
