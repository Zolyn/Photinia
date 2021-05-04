import * as inquirer from 'inquirer';
import * as async from 'async';
import * as fs from 'fs';
import * as shell from 'shelljs';
import { basename } from 'path';

import { Configuration, Errno, Logger, Template } from './modules/utils';
import { defaultConfig } from './config/default';
import { detectConfig } from './modules/runtimeConfig';
import { initProject } from './modules/init';

let config = defaultConfig;
let template: Template;
let templateFiles: string[];

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
            guide();
        }
    });
});

function guide() {
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
            templateFiles = [...template.files].map((val) => val[0]);
            filesGuide();
        })
        .catch((err: Errno) => Logger.err(err));

    function filesGuide() {
        inquirer
            .prompt([
                {
                    type: 'confirm',
                    name: 'allFiles',
                    message: 'Import all template files?',
                    default: true,
                },
                {
                    type: 'checkbox',
                    name: 'choseFiles',
                    message: 'Please select the file you want to import',
                    when: (answers) => !answers.allFiles,
                    choices: templateFiles,
                },
            ])
            .then((answers): void => {
                importFiles(answers.choseFiles);
            })
            .catch((err: Errno) => Logger.err(err));
    }
}

function importFiles(choseFiles?: string[]) {
    templateFiles = choseFiles || templateFiles;
    async.each(
        templateFiles,
        (item, callback) => {
            const filePath = `${config.repo}${item}`;
            const output = template.files.get(item) as string;
            fs.stat(filePath, (err, stat): void => {
                if (stat.isDirectory()) {
                    if (!shell.cp('-r', filePath, output).code) {
                        Logger.done(`Imported: ${basename(filePath)}`);
                        callback(null);
                    } else {
                        callback(new Error('Error'));
                    }
                }
            });
        },
        (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Complete.');
            }
        },
    );
}
