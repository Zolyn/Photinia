import * as asy from 'async';
import * as inquirer from 'inquirer';
import { resolve } from 'path';
import { awaitHelper, ChoiceBox, Logger, overrideKey, PackageJSON, photinia, Template } from './utils';
import * as shell from 'shelljs';

async function importation(template: Template) {
    let templatePackageInfo: PackageJSON;
    let choiceBox: ChoiceBox = {
        files: [],
        devDependencies: [],
        scripts: [],
    };

    // 询问是否导入全部文件
    const [promptErr, promptRes] = await awaitHelper(
        inquirer.prompt([
            {
                type: 'confirm',
                name: 'all',
                message: 'Import all files and configurations from the template?',
            },
        ]),
    );

    if (promptErr) {
        Logger.throw(promptErr);
    }

    // 读取模板仓库
    const readResult = shell.cat(`${photinia}/templates/${template.repo}/package.json`);
    if (readResult.code) {
        Logger.throw(readResult.stderr);
    }

    templatePackageInfo = JSON.parse(readResult.toString()) as PackageJSON;

    // 转换内容为提问时用到的数组
    choiceBox.files = [...template.fileMap].map((val) => val[0]);
    choiceBox.devDependencies = Object.entries(templatePackageInfo.devDependencies).map(
        (val) => `${val[0]} --- ${val[1]}`,
    );
    choiceBox.scripts = Object.entries(templatePackageInfo.scripts).map((val) => `${val[0]} --- ${val[1]}`);

    if (!promptRes.all) {
        const messages = ['files', 'devDependencies', 'scripts'];
        const [selectErr, selectRes] = await awaitHelper(
            inquirer.prompt(
                messages.map((val) => ({
                    type: 'checkbox',
                    name: val,
                    message: `Please select the ${val} you want to import`,
                    choices: choiceBox[val],
                    loop: false,
                })),
            ),
        );

        if (selectErr) {
            Logger.throw(selectErr);
        }

        overrideKey(selectRes, choiceBox, ['files', 'devDependencies', 'scripts']);
    }

    // 导入文件
    asy.each(
        choiceBox.files,
        (item, callback) => {
            const path = resolve(`${photinia}/templates/${template.repo}`, item);
            const out = template.fileMap.get(item) as string;
            let result: shell.ShellString = new shell.ShellString('Default string.');

            if (shell.test('-d', path)) {
                result = shell.cp('-r', path, out);
            } else if (shell.test('-f', path)) {
                result = shell.cp(path, out);
            } else {
                callback(new Error(`Could not find file ${item}`));
            }

            if (result.code) {
                callback(new Error(result.stderr));
            } else {
                Logger.info(`Imported: ${path}`);
                callback();
            }
        },
        (err) => {
            if (err) {
                Logger.err(err);
                throw 'Error in excuting asy.each() method...';
            } else {
                Logger.newLine(1);
            }
        },
    );
}

export { importation as importTemplate };
