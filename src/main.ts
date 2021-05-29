import {
    photinia,
    awaitHelper,
    Configuration,
    Logger,
    PackageJSON,
    Template,
    TemplateWithExtend,
    preProcess,
} from './modules/utils';
import { initProject } from './modules/init';
import { importTemplate } from './modules/import';
import * as sh from 'shelljs';
import * as inquirer from 'inquirer';
import { resolve } from 'path';
import { mergeExtend } from './modules/extend';

(async () => {
    let config: Configuration;
    let packageInfo: PackageJSON;
    let templatePackageInfo: PackageJSON = {
        devDependencies: {},
        scripts: {},
    };
    let template: Template;

    // 导入配置文件
    const [importErr, importRes] = await awaitHelper<Configuration>(import(`${photinia}/config.js`));
    if (importErr) {
        Logger.err(importErr);
        return;
    } else if (!importRes) {
        Logger.err('Unrecognized configuration.');
        return;
    }

    config = importRes;

    // 检测仓库
    if (!sh.test('-d', `${photinia}/templates`)) {
        Logger.err('Could not find the template repository.');
        return;
    }

    // 初始化项目
    const [initErr, initRes] = await awaitHelper(initProject());
    if (initErr) {
        Logger.err(initErr);
        return;
    } else if (!initRes) {
        Logger.err('Unrecognized package file.');
        return;
    }

    packageInfo = initRes;

    // 项目引导
    const templateMap = new Map(config.templates.map((val) => [val.name, val]));
    const [guideErr, guideRes] = await awaitHelper(
        inquirer.prompt([
            {
                type: 'list',
                name: 'template',
                message: 'Which template do you want to choose?',
                choices: [...templateMap].map((val) => val[0]),
            },
        ]),
    );

    if (guideErr) {
        Logger.err(guideErr);
        return;
    } else if (!guideRes) {
        Logger.err('Unknown error.');
        return;
    }

    const templateProxy = templateMap.get(guideRes.template);
    if (!templateProxy) {
        Logger.err('Could not find template!');
        return;
    }

    template = templateProxy;

    // 实验性功能：扩展
    if (template.extends) {
        const [extendErr, extendRes] = await awaitHelper(mergeExtend(template as TemplateWithExtend, templateMap));

        if (extendErr) {
            Logger.err(extendErr);
            return;
        } else if (!extendRes) {
            Logger.err('Unknown error.');
            return;
        }

        ({
            mergedFileMap: template.fileMap,
            mergedDevDeps: templatePackageInfo.devDependencies,
            mergedScripts: templatePackageInfo.scripts,
        } = extendRes);
    } else {
        template.fileMap = preProcess(template);
        const result = sh.cat(resolve(`${photinia}/templates`, template.repo, 'package.json'));
        if (result.code) {
            Logger.err(result.stderr);
            return;
        }

        ({ devDependencies: templatePackageInfo.devDependencies, scripts: templatePackageInfo.scripts } = JSON.parse(
            result.toString(),
        ));
    }

    const [templateErr] = await awaitHelper(importTemplate(template, templatePackageInfo, packageInfo));

    if (templateErr) {
        Logger.err(templateErr);
    }
})();
