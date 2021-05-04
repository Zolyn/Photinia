import * as inquirer from 'inquirer';
import * as async from 'async';
import * as fs from 'fs';

import { Template } from './utils';
import { defaultConfig } from './default';
import { importConfig } from './config';

let config = defaultConfig;
let template: Template;
let templateFiles: string[];

importConfig((err, result) => {
    if (err) {
        console.log('Could not find configuration. Using default config...');
    } else {
        config = result as Template[];
        console.log(config);
    }
    guide();
});

function guide() {
    const symbolicLinks = new Map(config.map((val) => [val.name, val]));
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'template',
                message: 'Which template do you want to choose?',
                choices: [...symbolicLinks].map((val) => val[0]),
            },
        ])
        .then((answers) => {
            template = symbolicLinks.get(answers.template) as Template;
            templateFiles = [...template.files].map((val) => val[0]);
            filesGuide();
        })
        .catch((err) => console.error(err));

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
            .then((answers) => {
                importFiles(answers.choseFiles);
            })
            .catch((err) => console.error(err));
    }
}

function importFiles(choseFiles?: string[]) {
    templateFiles = choseFiles || templateFiles;
    async.each(
        templateFiles,
        (item, callback) => {
            const output = template.files.get(item) as string;
            fs.copyFile(item, output, (err) => {
                if (err) {
                    callback(err);
                } else {
                    console.log('Imported: ', item);
                    callback();
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
