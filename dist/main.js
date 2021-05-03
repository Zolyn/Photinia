"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findUp = require("find-up");
const result = findUp.sync('.photiniarc.js');
console.log(result);
