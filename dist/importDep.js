"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shell = require("shelljs");
const packageInfo = JSON.parse(shell.cat('../package.json').toString());
console.log(packageInfo.scripts);
