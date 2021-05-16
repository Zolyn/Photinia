"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectConfig = void 0;
const os = require("os");
function detectConfig(callback) {
    Promise.resolve().then(() => require(`${os.homedir()}/.config/photinia/config.js`)).then((module) => callback(null, module))
        .catch((err) => callback(err));
}
exports.detectConfig = detectConfig;
