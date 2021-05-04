"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shell = require("shelljs");
const inquirer = require("inquirer");
const prettier = require("prettier");
const fs = require("fs");
let packageInfo;
console.log('Initializing package.json...');
if (!shell.exec('npm init -y', { silent: true }).code) {
    console.log('Complete.');
    packageInfo = JSON.parse(shell.cat('package.json').toString());
    initGuide();
}
function initGuide() {
    const questions = [
        'name',
        'version',
        'description',
        'main',
        'repository',
        'author',
        'license'
    ];
    inquirer.prompt(questions.map(val => ({
        type: 'input',
        name: val,
        message: val,
        default: packageInfo[val] ? packageInfo[val] : 'None',
        filter: val => val !== 'None' ? val : ''
    }))).then(answers => {
        fs.writeFile('package.json', prettier.format(JSON.stringify(Object.assign(Object.assign({}, packageInfo), answers)), { parser: "json" }), err => {
            if (err) {
                console.error(err);
            }
            else {
                console.log('Complete.');
            }
        });
    });
}
