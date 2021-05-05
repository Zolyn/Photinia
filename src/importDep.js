'use strict';
exports.__esModule = true;
var shell = require('shelljs');
var packageInfo = JSON.parse(shell.cat('../package.json').toString());
console.log(packageInfo.scripts);
