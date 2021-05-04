"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProject = void 0;
const shell = require("shelljs");
const inquirer = require("inquirer");
const prettier = require("prettier");
const utils_1 = require("./utils");
function initProject(config, callback) {
    let packageInfo = {};
    utils_1.Logger.info('Initializing package.json...');
    if (!shell.exec(`${config.initPackageManager} init -y`, { silent: true }).code) {
        utils_1.Logger.done('Completed.');
        packageInfo = JSON.parse(shell.cat('package.json').toString());
        initGuide();
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
            utils_1.Logger.info('Writing to package.json...');
            const formattedString = shell.echo(prettier.format(JSON.stringify(Object.assign(Object.assign({}, packageInfo), answers)), { parser: 'json-stringify' }));
            if (!formattedString.code) {
                formattedString.to('package.json');
                callback(null);
            }
            else {
                callback('Error');
            }
        });
    }
}
exports.initProject = initProject;
