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
let checkBox = {
    files: [''],
    devDependencies: [''],
    scripts: [''],
};
runtimeConfig_1.detectConfig((err, result) => {
    if (err) {
        utils_1.Logger.warn('Could not find configuration. Using default config...');
    }
    else {
        config = result;
        utils_1.Logger.debug(config);
    }
    init_1.initProject(config, (err_1) => {
        if (err_1) {
            utils_1.Logger.err(err_1);
        }
        else {
            templateGuide();
        }
    });
});
function templateGuide() {
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
        checkBox.files = [...template.files].map((val) => val[0]);
        checkBox.devDependencies = Object.entries(template.devDeps).map((val) => `${val[0]}@${val[1]}`);
        checkBox.scripts = Object.entries(template.scripts).map((val) => `${val[0]} - ${val[1]}`);
        mainGuide();
    })
        .catch((err) => utils_1.Logger.err(err));
}
function mainGuide() {
    const questions = ['files', 'devDependencies', 'scripts'];
    inquirer
        .prompt(questions.map((val) => ({
        type: 'checkbox',
        name: val,
        message: `Please select the ${val} you want to import`,
        choices: checkBox[val],
        loop: false,
    })))
        .then((answers) => {
        checkBox = answers;
        utils_1.Logger.debug(answers);
    });
}
function importFiles() {
    async.each(checkBox.files, (item, callback) => {
        const filePath = path_1.resolve(config.repo, item);
        const output = template.files.get(item);
        let result;
        fs.stat(filePath, (err, stat) => {
            if (err) {
                callback(err);
            }
            else if (stat.isDirectory()) {
                result = shell.cp('-r', filePath, output);
            }
            else {
                result = shell.cp(filePath, output);
            }
            if (!result.code) {
                utils_1.Logger.done(`Imported: ${path_1.basename(filePath)}`);
                callback();
            }
            else {
                callback(new Error(result.stderr));
            }
        });
    }, (err) => {
        if (err) {
            utils_1.Logger.err(err);
        }
        else {
            utils_1.Logger.done('Complete');
        }
    });
}
