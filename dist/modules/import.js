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
exports.importTemplate = void 0;
const asy = require("async");
const inquirer = require("inquirer");
const prettier = require("prettier");
const path_1 = require("path");
const utils_1 = require("./utils");
const sh = require("shelljs");
function importation(template, templatePackageInfo, packageFile) {
    return __awaiter(this, void 0, void 0, function* () {
        let choiceBox = {
            files: [],
            devDependencies: [],
            scripts: [],
        };
        // 询问是否导入全部文件
        const [promptErr, promptRes] = yield utils_1.awaitHelper(inquirer.prompt([
            {
                type: 'confirm',
                name: 'all',
                message: 'Import all files and configurations from the template?',
            },
        ]));
        if (promptErr) {
            utils_1.Logger.throw(promptErr);
        }
        // 转换内容为提问时用到的数组
        choiceBox.files = [...template.fileMap].map((val) => val[0]);
        choiceBox.devDependencies = Object.entries(templatePackageInfo.devDependencies).map((val) => `${val[0]} --- ${val[1]}`);
        choiceBox.scripts = Object.entries(templatePackageInfo.scripts).map((val) => `${val[0]} --- ${val[1]}`);
        if (!promptRes.all) {
            const messages = ['files', 'devDependencies', 'scripts'];
            const [selectErr, selectRes] = yield utils_1.awaitHelper(inquirer.prompt(messages.map((val) => ({
                type: 'checkbox',
                name: val,
                message: `Please select the ${val} you want to import`,
                choices: choiceBox[val],
                loop: false,
            }))));
            if (selectErr) {
                utils_1.Logger.throw(selectErr);
            }
            else if (!selectRes) {
                utils_1.Logger.throw('Unknown error');
            }
            choiceBox = selectRes;
        }
        // 导入文件
        asy.each(choiceBox.files, (item, callback) => {
            const path = path_1.resolve(`${utils_1.photinia}/templates`, item);
            const out = template.fileMap.get(item);
            if (!out) {
                utils_1.Logger.throw(`Could not get output path!`);
            }
            let result = new sh.ShellString('Default string.');
            if (sh.test('-d', path)) {
                result = sh.cp('-r', path, out);
            }
            else if (sh.test('-f', path)) {
                result = sh.cp(path, out);
            }
            else {
                callback(new Error(`Could not find file ${item}`));
            }
            if (result.code) {
                callback(new Error(result.stderr));
            }
            else {
                utils_1.Logger.info(`Imported: ${path}`);
                callback();
            }
        }, (err) => {
            if (err) {
                utils_1.Logger.err(err);
                utils_1.Logger.throw('Error in excuting asy.each() method...');
            }
            else {
                utils_1.Logger.newLine(1);
                configurePackageFile();
            }
        });
        function configurePackageFile() {
            utils_1.Logger.info('Configuring package.json...');
            const devDependencies = utils_1.arrayToObject(choiceBox.devDependencies);
            const scripts = utils_1.arrayToObject(choiceBox.scripts);
            const result = sh.echo(prettier.format(JSON.stringify(Object.assign(Object.assign({}, packageFile), { devDependencies, scripts })), {
                parser: 'json-stringify',
            }));
            if (result.code) {
                utils_1.Logger.throw(result.stderr);
            }
            else {
                result.to('package.json');
                utils_1.Logger.done('Whoo! Your project is already generated by Photinia.');
            }
        }
    });
}
exports.importTemplate = importation;
//# sourceMappingURL=import.js.map