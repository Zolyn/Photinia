"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
const async = require("async");
const fs = require("fs");
const default_1 = require("./default");
const config_1 = require("./config");
let config = default_1.defaultConfig;
let template;
let templateFiles;
config_1.importConfig((err, result) => {
    if (err) {
        console.log('Could not find configuration. Using default config...');
    }
    else {
        config = result;
        console.log(config);
    }
    guide();
});
function guide() {
    const symbolicLinks = new Map(config.map((val) => [val.name, val]));
    inquirer.prompt([
        {
            type: 'list',
            name: 'template',
            message: 'Which template do you want to choose?',
            choices: [...symbolicLinks].map(val => val[0])
        }
    ]).then(answers => {
        template = symbolicLinks.get(answers.template);
        templateFiles = [...template.files].map(val => val[0]);
        filesGuide();
    }).catch(err => console.error(err));
    function filesGuide() {
        inquirer.prompt([
            {
                type: 'confirm',
                name: 'allFiles',
                message: 'Import all template files?',
                default: true
            },
            {
                type: 'checkbox',
                name: 'choseFiles',
                message: 'Please select the file you want to import',
                when: answers => !answers.allFiles,
                choices: templateFiles
            }
        ]).then(answers => {
            importFiles(answers.choseFiles);
        }).catch(err => console.error(err));
    }
}
function importFiles(choseFiles) {
    templateFiles = choseFiles || templateFiles;
    async.each(templateFiles, (item, callback) => {
        const output = template.files.get(item);
        fs.copyFile(item, output, err => {
            if (err) {
                callback(err);
            }
            else {
                console.log('Imported: ', item);
                callback();
            }
        });
    }, err => {
        if (err) {
            console.error(err);
        }
        else {
            console.log('Complete.');
        }
    });
}
