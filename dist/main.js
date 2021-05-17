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
const shell = require("shelljs");
const inquirer = require("inquirer");
(() => __awaiter(void 0, void 0, void 0, function* () {
    let config;
    let packageInfo;
    let template;
    // 导入配置文件
    const [importErr, importRes] = yield utils_1.awaitHelper(Promise.resolve().then(() => require(`${utils_1.photinia}/config.js`)));
    if (importErr) {
        utils_1.Logger.err(importErr);
        return;
    }
    config = importRes;
    // 检测仓库
    if (!shell.test('-d', `${utils_1.photinia}/templates`)) {
        utils_1.Logger.err('Could not find the template repository.');
        return;
    }
    // 初始化项目
    const [initErr, initRes] = yield utils_1.awaitHelper(init_1.initProject());
    if (initErr) {
        utils_1.Logger.err(initErr);
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
    template = templateMap.get(guideRes.template);
    const [templateErr] = yield utils_1.awaitHelper(import_1.importTemplate(template, packageInfo));
    if (templateErr) {
        utils_1.Logger.err(templateErr);
    }
}))();
