'use strict';
var __assign =
    (this && this.__assign) ||
    function () {
        __assign =
            Object.assign ||
            function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                }
                return t;
            };
        return __assign.apply(this, arguments);
    };
exports.__esModule = true;
exports.initProject = void 0;
var shell = require('shelljs');
var inquirer = require('inquirer');
var prettier = require('prettier');
var utils_1 = require('./utils');
function initProject(config, callback) {
    var packageInfo = {};
    utils_1.Logger.info('Initializing package.json...');
    if (!shell.exec(config.initPackageManager + ' init -y', { silent: true }).code) {
        utils_1.Logger.done('Completed.');
        packageInfo = JSON.parse(shell.cat('package.json').toString());
        initGuide();
    }
    function initGuide() {
        var questions = ['name', 'version', 'description', 'main', 'repository', 'author', 'license'];
        inquirer
            .prompt(
                questions.map(function (val) {
                    return {
                        type: 'input',
                        name: val,
                        message: val,
                        default: packageInfo[val] ? packageInfo[val] : 'None',
                        filter: function (val) {
                            return val !== 'None' ? val : '';
                        },
                    };
                }),
            )
            .then(function (answers) {
                utils_1.Logger.info('Writing to package.json...');
                var formattedString = shell.echo(
                    prettier.format(JSON.stringify(__assign(__assign({}, packageInfo), answers)), {
                        parser: 'json-stringify',
                    }),
                );
                if (!formattedString.code) {
                    formattedString.to('package.json');
                    callback(null);
                } else {
                    callback('Error');
                }
            });
    }
}
exports.initProject = initProject;
