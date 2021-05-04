"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shell = require("shelljs");
const prettier = require("prettier");
const packageInfo = JSON.parse(shell.cat('../package.json').toString());
shell.echo(prettier.format(JSON.stringify(packageInfo), { parser: 'json-stringify' })).to('pkg.json');
