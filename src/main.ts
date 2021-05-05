import * as inquirer from 'inquirer';
import * as async from 'async';
import * as fs from 'fs';
import * as shell from 'shelljs';
import { basename, resolve } from 'path';

import { CallbackFn, CheckBox, Configuration, Errno, Logger, Template } from './modules/utils';
import { defaultConfig } from './config/default';
import { detectConfig } from './modules/runtimeConfig';
import { initProject } from './modules/init';

let config = defaultConfig;
let template: Template;
let checkBox: CheckBox = {
    files: [''],
    devDependencies: [''],
    scripts: [''],
};

detectConfig((err, result) => {
    if (err) {
        Logger.warn('Could not find configuration. Using default config...');
    } else {
        config = result as Configuration;
        Logger.debug(config);
    }

    initProject(config, (err_1) => {
        if (err_1) {
            Logger.err(err_1);
        } else {
            templateGuide();
        }
    });
});

function templateGuide() {
    const templateLinks = new Map(config.templates.map((val): [string, Template] => [val.name, val]));
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'template',
                message: 'Which template do you want to choose?',
                choices: [...templateLinks].map((val) => val[0]),
            },
        ])
        .then((answers): void => {
            template = templateLinks.get(answers.template) as Template;
            checkBox.files = [...template.files].map((val) => val[0]);
            checkBox.devDependencies = Object.entries(template.devDeps).map((val) => `${val[0]}@${val[1]}`);
            checkBox.scripts = Object.entries(template.scripts).map((val) => `${val[0]} - ${val[1]}`);
            mainGuide();
        })
        .catch((err: Errno) => Logger.err(err));
}

function mainGuide() {
    const questions = ['files', 'devDependencies', 'scripts'];
    inquirer
        .prompt(
            questions.map((val) => ({
                type: 'checkbox',
                name: val,
                message: `Please select the ${val} you want to import`,
                choices: checkBox[val],
                loop: false,
            })),
        )
        .then((answers: CheckBox) => {
            checkBox = answers;
            Logger.debug(answers);
        });
}

function importFiles() {
    async.each(
        checkBox.files,
        (item, callback) => {
            const filePath = resolve(config.repo, item);
            const output = template.files.get(item) as string;
            let result: shell.ShellString;
            fs.stat(filePath, (err, stat): void => {
                if (err) {
                    callback(err);
                } else if (stat.isDirectory()) {
                    result = shell.cp('-r', filePath, output);
                } else {
                    result = shell.cp(filePath, output);
                }
                if (!result.code) {
                    Logger.done(`Imported: ${basename(filePath)}`);
                    callback();
                } else {
                    callback(new Error(result.stderr));
                }
            });
        },
        (err) => {
            if (err) {
                Logger.err(err);
            } else {
                Logger.done('Complete');
            }
        },
    );
}
