"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
const async = require("async");
const fs = require("fs");
const shell = require("shelljs");
const path_1 = require("path");
const utils_1 = require("./modules/utils");
const default_1 = require("./config/default");
const runtimeConfig_1 = require("./modules/runtimeConfig");
const init_1 = require("./modules/init");
let config = default_1.defaultConfig;
let template;
let templateFiles;
runtimeConfig_1.detectConfig((err, result) => {
    if (err) {
        utils_1.Logger.warn('Could not find configuration. Using default config...');
    }
    else {
        config = result;
        utils_1.Logger.debug(config);
    }
    init_1.initProject(config, err_1 => {
        if (err_1) {
            utils_1.Logger.err(err_1);
        }
        else {
            guide();
        }
    });
});
function guide() {
    const templateLinks = new Map(config.templates.map((val) => [val.name, val]));
    inquirer
        .prompt([
        {
            type: 'list',
            name: 'template',
            message: 'Which template do you want to choose?',
            choices: [...templateLinks].map((val) => val[0]),
        },
    ])
        .then((answers) => {
        template = templateLinks.get(answers.template);
        templateFiles = [...template.files].map((val) => val[0]);
        filesGuide();
    })
        .catch((err) => utils_1.Logger.err(err));
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
            .catch((err) => utils_1.Logger.err(err));
    }
}
function importFiles(choseFiles) {
    templateFiles = choseFiles || templateFiles;
    async.each(templateFiles, (item, callback) => {
        const filePath = `${config.repo}${item}`;
        const output = template.files.get(item);
        fs.stat(filePath, (err, stat) => {
            if (stat.isDirectory()) {
                if (!shell.cp('-r', filePath, output).code) {
                    utils_1.Logger.done(`Imported: ${path_1.basename(filePath)}`);
                    callback(null);
                }
                else {
                    callback(new Error('Error'));
                }
            }
        });
    }, (err) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log('Complete.');
        }
    });
}
