import {
    photinia,
    awaitHelper,
    Configuration,
    Logger,
    PackageJSON,
    Template,
    TemplateWithExtend,
} from './modules/utils';
import { initProject } from './modules/init';
import { importTemplate } from './modules/import';
import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import { mergeExtend } from './modules/extend';

(async () => {
    let config: Configuration;
    let packageInfo: PackageJSON;
    let template: Template;

    // 导入配置文件
    const [importErr, importRes] = await awaitHelper<Configuration>(import(`${photinia}/config.js`));
    if (importErr) {
        Logger.err(importErr);
        return;
    }
    config = importRes as Configuration;

    // 检测仓库
    if (!shell.test('-d', `${photinia}/templates`)) {
        Logger.err('Could not find the template repository.');
        return;
    }

    // 初始化项目
    const [initErr, initRes] = await awaitHelper(initProject());
    if (initErr) {
        Logger.err(initErr);
        return;
    }

    packageInfo = initRes as PackageJSON;

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
    }

    template = templateMap.get(guideRes.template) as Template;

    // 实验性功能：继承
    if (template.extends) {
        const [extendErr, extendRes] = await awaitHelper(mergeExtend(template as TemplateWithExtend, templateMap));
        if (extendErr) {
            Logger.err(extendErr);
            return;
        }
    }

    const [templateErr] = await awaitHelper(importTemplate(template, packageInfo));

    if (templateErr) {
        Logger.err(templateErr);
    }
})();
