"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
const async = require("async");
const prettier = require("prettier");
const shell = require("shelljs");
const path_1 = require("path");
const utils_1 = require("./modules/utils");
const default_1 = require("./config/default");
const runtimeConfig_1 = require("./modules/runtimeConfig");
const init_1 = require("./modules/init");
let config = default_1.defaultConfig;
let packageFile;
let template;
let checkBox = {
    files: [''],
    devDependencies: [''],
    scripts: [''],
};
runtimeConfig_1.detectConfig((err, result) => {
    if (err) {
        utils_1.Logger.warn('Could not find configuration. Using default config...');
        utils_1.Logger.newLine(1);
    }
    else {
        config = result;
        utils_1.Logger.info('Configuration was detected.');
        utils_1.Logger.newLine(1);
    }
    if (shell.test('-d', config.repo)) {
        utils_1.Logger.info('Repository was found.');
        init_1.initProject(config, (err_1, result) => {
            if (err_1) {
                utils_1.Logger.err(err_1);
            }
            else {
                packageFile = result;
                templateGuide();
            }
        });
    }
    else {
        utils_1.Logger.err('Could not find the repository.');
    }
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
        checkBox.devDependencies = Object.entries(template.devDeps).map((val) => `${val[0]} --- ${val[1]}`);
        checkBox.scripts = Object.entries(template.scripts).map((val) => `${val[0]} --- ${val[1]}`);
        mainGuide();
    })
        .catch((err) => utils_1.Logger.err(err));
}
function mainGuide() {
    const messages = ['files', 'devDependencies', 'scripts'];
    inquirer
        .prompt([
        {
            type: 'confirm',
            name: 'importAll',
            message: 'Import all configurations from the template?',
        },
    ].concat(messages.map((val) => ({
        type: 'checkbox',
        name: val,
        message: `Please select the ${val} you want to import`,
        choices: checkBox[val],
        loop: false,
        when: (answer) => !answer.importAll,
    }))))
        .then((answers) => {
        if (!answers.importAll) {
            ({
                files: checkBox.files,
                devDependencies: checkBox.devDependencies,
                scripts: checkBox.scripts,
            } = answers);
        }
        importFiles();
    });
}
function importFiles() {
    utils_1.Logger.info('Importing files...');
    async.each(checkBox.files, (item, callback) => {
        const filePath = path_1.resolve(config.repo, item);
        const output = template.files.get(item);
        let result;
        if (shell.test('-d', filePath)) {
            result = shell.cp('-r', filePath, output);
        }
        else if (shell.test('-f', filePath)) {
            result = shell.cp(filePath, output);
        }
        else {
            callback(new Error(`Could not find file ${item}`));
        }
        // @ts-ignore
        if (!result.code) {
            utils_1.Logger.info(`Imported: ${filePath}`);
            callback();
        }
        else {
            // @ts-ignore
            callback(new Error(result.stderr));
        }
    }, (err) => {
        if (err) {
            utils_1.Logger.err(err);
            shell.exit(1);
        }
        else {
            utils_1.Logger.newLine(1);
            configurePackage();
        }
    });
}
function configurePackage() {
    utils_1.Logger.info('Configuring package.json...');
    const devDependencies = {};
    const scripts = {};
    checkBox.devDependencies.map((val) => {
        const depInfo = val.split('---');
        devDependencies[depInfo[0].trim()] = depInfo[1].trim();
        return undefined;
    });
    checkBox.scripts.map((val) => {
        const scriptInfo = val.split('---');
        scripts[scriptInfo[0].trim()] = scriptInfo[1].trim();
        return undefined;
    });
    const result = shell.echo(prettier.format(JSON.stringify(Object.assign(Object.assign({}, packageFile), { devDependencies, scripts })), {
        parser: 'json-stringify',
    }));
    if (result.code) {
        utils_1.Logger.err(result.stderr);
    }
    else {
        result.to('package.json');
        utils_1.Logger.done('Whoo! Your project is already generated by Photinia.');
    }
}
