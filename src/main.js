'use strict';
var __spreadArray =
    (this && this.__spreadArray) ||
    function (to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];
        return to;
    };
exports.__esModule = true;
var inquirer = require('inquirer');
var async = require('async');
var fs = require('fs');
var shell = require('shelljs');
var path_1 = require('path');
var utils_1 = require('./modules/utils');
var default_1 = require('./config/default');
var runtimeConfig_1 = require('./modules/runtimeConfig');
var init_1 = require('./modules/init');
var config = default_1.defaultConfig;
var template;
var checkBox = {
    files: [''],
    devDependencies: [''],
    scripts: [''],
};
runtimeConfig_1.detectConfig(function (err, result) {
    if (err) {
        utils_1.Logger.warn('Could not find configuration. Using default config...');
    } else {
        config = result;
        utils_1.Logger.debug(config);
    }
    init_1.initProject(config, function (err_1) {
        if (err_1) {
            utils_1.Logger.err(err_1);
        } else {
            templateGuide();
        }
    });
});
function templateGuide() {
    var templateLinks = new Map(
        config.templates.map(function (val) {
            return [val.name, val];
        }),
    );
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'template',
                message: 'Which template do you want to choose?',
                choices: __spreadArray([], templateLinks).map(function (val) {
                    return val[0];
                }),
            },
        ])
        .then(function (answers) {
            template = templateLinks.get(answers.template);
            checkBox.files = __spreadArray([], template.files).map(function (val) {
                return val[0];
            });
            checkBox.devDependencies = Object.entries(template.devDeps).map(function (val) {
                return val[0] + '@' + val[1];
            });
            checkBox.scripts = Object.entries(template.scripts).map(function (val) {
                return val[0] + ' - ' + val[1];
            });
            mainGuide();
        })
        ['catch'](function (err) {
            return utils_1.Logger.err(err);
        });
}
function mainGuide() {
    var questions = ['files', 'devDependencies', 'scripts'];
    inquirer
        .prompt(
            questions.map(function (val) {
                return {
                    type: 'checkbox',
                    name: val,
                    message: 'Please select the ' + val + ' you want to import',
                    choices: checkBox[val],
                    loop: false,
                };
            }),
        )
        .then(function (answers) {
            checkBox = answers;
            utils_1.Logger.debug(answers);
        });
}
function importFiles() {
    async.each(
        checkBox.files,
        function (item, callback) {
            var filePath = path_1.resolve(config.repo, item);
            var output = template.files.get(item);
            var result;
            fs.stat(filePath, function (err, stat) {
                if (err) {
                    callback(err);
                } else if (stat.isDirectory()) {
                    result = shell.cp('-r', filePath, output);
                } else {
                    result = shell.cp(filePath, output);
                }
                if (!result.code) {
                    utils_1.Logger.done('Imported: ' + path_1.basename(filePath));
                    callback();
                } else {
                    callback(new Error(result.stderr));
                }
            });
        },
        function (err) {
            if (err) {
                utils_1.Logger.err(err);
            } else {
                utils_1.Logger.done('Complete');
            }
        },
    );
}
