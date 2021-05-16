"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProject = void 0;
const shell = require("shelljs");
const inquirer = require("inquirer");
const prettier = require("prettier");
const semver = require("semver");
const utils_1 = require("./utils");
shell.config.silent = true;
function initProject(config, callback) {
    let packageInfo = {};
    let result = readPackage();
    if (result) {
        utils_1.Logger.info('Package.json already exists, skipping...');
        utils_1.Logger.newLine(1);
        callback(null, result);
    }
    else {
        utils_1.Logger.info('Package.json does not exists, initializing...');
        utils_1.Logger.newLine(1);
        const intializeResult = shell.exec(`${config.initPackageManager} init -y`, { silent: true });
        if (intializeResult.code) {
            callback(intializeResult.stderr);
        }
        else {
            packageInfo = readPackage();
            initGuide();
        }
    }
    function readPackage() {
        const result = shell.cat('package.json');
        if (result.code) {
            utils_1.Logger.warn(result.stderr);
            return undefined;
        }
        else {
            return JSON.parse(result.toString());
        }
    }
    function initGuide() {
        const questions = ['name', 'version', 'description', 'main', 'repository', 'author', 'license'];
        inquirer
            .prompt(questions.map((val) => ({
            type: 'input',
            name: val,
            message: val,
            default: packageInfo[val] ? packageInfo[val] : 'None',
            filter: (val) => (val !== 'None' ? val : ''),
        })))
            .then((answers) => {
            utils_1.Logger.newLine(1);
            utils_1.Logger.info('Writing to package.json...');
            if (semver.valid(answers.version)) {
                const mergedPackageInfo = Object.assign(Object.assign({}, packageInfo), answers);
                const formattedString = shell.echo(prettier.format(JSON.stringify(mergedPackageInfo), { parser: 'json-stringify' }));
                if (formattedString.code) {
                    callback(formattedString.stderr);
                }
                else {
                    formattedString.to('package.json');
                    utils_1.Logger.done('Completed.');
                    utils_1.Logger.newLine(1);
                    callback(null, mergedPackageInfo);
                }
            }
            else {
                callback('Cannot write package version to package.json. Is the format correct?');
                utils_1.Logger.newLine(1);
                initGuide();
            }
        });
    }
}
exports.initProject = initProject;
