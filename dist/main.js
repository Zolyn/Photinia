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
const utils_1 = require("./modules/utils");
const init_1 = require("./modules/init");
const import_1 = require("./modules/import");
const sh = require("shelljs");
const inquirer = require("inquirer");
const path_1 = require("path");
const extend_1 = require("./modules/extend");
(() => __awaiter(void 0, void 0, void 0, function* () {
    let config;
    let packageInfo;
    let templatePackageInfo = {
        devDependencies: {},
        scripts: {},
    };
    let template;
    // 导入配置文件
    const [importErr, importRes] = yield utils_1.awaitHelper(Promise.resolve().then(() => require(`${utils_1.photinia}/config.js`)));
    if (importErr) {
        utils_1.Logger.err(importErr);
        return;
    }
    else if (!importRes) {
        utils_1.Logger.err('Unrecognized configuration.');
        return;
    }
    config = importRes;
    // 检测仓库
    if (!sh.test('-d', `${utils_1.photinia}/templates`)) {
        utils_1.Logger.err('Could not find the template repository.');
        return;
    }
    // 初始化项目
    const [initErr, initRes] = yield utils_1.awaitHelper(init_1.initProject());
    if (initErr) {
        utils_1.Logger.err(initErr);
        return;
    }
    else if (!initRes) {
        utils_1.Logger.err('Unrecognized package file.');
        return;
    }
    packageInfo = initRes;
    // 项目引导
    const templateMap = new Map(config.templates.map((val) => [val.name, val]));
    const [guideErr, guideRes] = yield utils_1.awaitHelper(inquirer.prompt([
        {
            type: 'list',
            name: 'template',
            message: 'Which template do you want to choose?',
            choices: [...templateMap].map((val) => val[0]),
        },
    ]));
    if (guideErr) {
        utils_1.Logger.err(guideErr);
        return;
    }
    else if (!guideRes) {
        utils_1.Logger.err('Unknown error.');
        return;
    }
    const templateProxy = templateMap.get(guideRes.template);
    if (!templateProxy) {
        utils_1.Logger.err('Could not find template!');
        return;
    }
    template = templateProxy;
    // 实验性功能：扩展
    if (template.extends) {
        const [extendErr, extendRes] = yield utils_1.awaitHelper(extend_1.mergeExtend(template, templateMap));
        if (extendErr) {
            utils_1.Logger.err(extendErr);
            return;
        }
        else if (!extendRes) {
            utils_1.Logger.err('Unknown error.');
            return;
        }
        ({
            mergedFileMap: template.fileMap,
            mergedDevDeps: templatePackageInfo.devDependencies,
            mergedScripts: templatePackageInfo.scripts,
        } = extendRes);
    }
    else {
        template.fileMap = utils_1.preProcess(template);
        const result = sh.cat(path_1.resolve(`${utils_1.photinia}/templates`, template.repo, 'package.json'));
        if (result.code) {
            utils_1.Logger.err(result.stderr);
            return;
        }
        ({ devDependencies: templatePackageInfo.devDependencies, scripts: templatePackageInfo.scripts } = JSON.parse(result.toString()));
    }
    const [templateErr] = yield utils_1.awaitHelper(import_1.importTemplate(template, templatePackageInfo, packageInfo));
    if (templateErr) {
        utils_1.Logger.err(templateErr);
    }
}))();
