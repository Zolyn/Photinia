"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProject = void 0;
const inquirer = require("inquirer");
const utils_1 = require("./utils");
const shell = require("shelljs");
const semver = require("semver");
const prettier = require("prettier");
shell.config.silent = true;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        let packageInfo = readPackage();
        if (packageInfo) {
            utils_1.Logger.info('Package.json already exists, skipping...');
            utils_1.Logger.newLine(1);
            return packageInfo;
        }
        utils_1.Logger.info('Package.json does not exists, initializing...');
        utils_1.Logger.newLine(1);
        const initializeResult = shell.exec(`yarn init -y`);
        if (initializeResult.code) {
            utils_1.Logger.throw(initializeResult.stderr);
        }
        // 重新读取package.json
        packageInfo = readPackage();
        if (!packageInfo) {
            utils_1.Logger.throw('Could not read package.json!');
        }
        const promptQuestions = [
            'name',
            'version',
            'description',
            'main',
            'repository',
            'author',
            'license',
        ];
        const [promptErr, promptRes] = yield utils_1.awaitHelper(inquirer.prompt(promptQuestions.map((val) => ({
            type: 'input',
            name: val,
            message: val,
            // TS无法推断packageInfo变量是有值的，故忽略检查
            // @ts-ignore
            default: packageInfo[val] ? packageInfo[val] : 'None',
            filter: (val) => (val !== 'None' ? val : ''),
        }))));
        if (promptErr) {
            utils_1.Logger.throw(promptErr);
        }
        utils_1.Logger.newLine(1);
        utils_1.Logger.info('Writing to package.json...');
        if (semver.valid(promptRes.version)) {
            const mergedPackageInfo = Object.assign(Object.assign({}, packageInfo), promptRes);
            const formattedString = shell.echo(prettier.format(JSON.stringify(mergedPackageInfo), { parser: 'json-stringify' }));
            if (formattedString.code) {
                utils_1.Logger.throw(formattedString.stderr);
            }
            else {
                formattedString.to('package.json');
                utils_1.Logger.done('Completed.');
                utils_1.Logger.newLine(1);
                return mergedPackageInfo;
            }
        }
        else {
            utils_1.Logger.throw('Cannot write package version to package.json. Is the format correct?');
        }
        function readPackage() {
            const result = shell.cat('package.json');
            if (result.code) {
                utils_1.Logger.warn(result.stderr);
                return undefined;
            }
            else {
                return JSON.parse(result.toString());
            }
        }
    });
}
exports.initProject = init;
//# sourceMappingURL=init.js.map