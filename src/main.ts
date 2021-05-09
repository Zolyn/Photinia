import * as inquirer from 'inquirer';
import * as async from 'async';
import * as prettier from 'prettier';
import * as shell from 'shelljs';
import { resolve } from 'path';

import { CheckBox, Configuration, Errno, Logger, PackageJSON, Template } from './modules/utils';
import { defaultConfig } from './config/default';
import { detectConfig } from './modules/runtimeConfig';
import { initProject } from './modules/init';

let config = defaultConfig;
let packageFile: PackageJSON;
let template: Template;
let checkBox: CheckBox = {
    files: [''],
    devDependencies: [''],
    scripts: [''],
};

detectConfig((err, result) => {
    if (err) {
        Logger.warn('Could not find configuration. Using default config...');
        Logger.newLine(1);
    } else {
        config = result as Configuration;
        Logger.info('Configuration was detected.');
        Logger.newLine(1);
    }
    if (shell.test('-d', config.repo)) {
        Logger.info('Repository was found.');
        initProject(config, (err_1, result) => {
            if (err_1) {
                Logger.err(err_1);
            } else {
                packageFile = result as PackageJSON;
                templateGuide();
            }
        });
    } else {
        Logger.err('Could not find the repository.');
    }
});

function templateGuide() {
    const templateLinks = new Map(config.templates.map((val): [string, Template] => [val.name, val]));
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'template',
                message: 'Which template do you want to choose?',
                choices: [...templateLinks].map((val) => val[0]),
            },
        ])
        .then((answers): void => {
            template = templateLinks.get(answers.template) as Template;
            checkBox.files = [...template.files].map((val) => val[0]);
            checkBox.devDependencies = Object.entries(template.devDeps).map((val) => `${val[0]} --- ${val[1]}`);
            checkBox.scripts = Object.entries(template.scripts).map((val) => `${val[0]} --- ${val[1]}`);
            mainGuide();
        })
        .catch((err: Errno) => Logger.err(err));
}

function mainGuide() {
    const messages = ['files', 'devDependencies', 'scripts'];
    inquirer
        .prompt(
            [
                {
                    type: 'confirm',
                    name: 'importAll',
                    message: 'Import all configurations from the template?',
                },
            ].concat(
                messages.map((val) => ({
                    type: 'checkbox',
                    name: val,
                    message: `Please select the ${val} you want to import`,
                    choices: checkBox[val],
                    loop: false,
                    when: (answer: { importAll: boolean }) => !answer.importAll,
                })),
            ),
        )
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
    Logger.info('Importing files...');
    async.each(
        checkBox.files,
        (item, callback) => {
            const filePath = resolve(config.repo, item);
            const output = template.files.get(item) as string;
            let result: shell.ShellString;

            if (shell.test('-d', filePath)) {
                result = shell.cp('-r', filePath, output);
            } else if (shell.test('-f', filePath)) {
                result = shell.cp(filePath, output);
            } else {
                callback(new Error(`Could not find file ${item}`));
            }
            // @ts-ignore
            if (!result.code) {
                Logger.info(`Imported: ${filePath}`);
                callback();
            } else {
                // @ts-ignore
                callback(new Error(result.stderr));
            }
        },
        (err) => {
            if (err) {
                Logger.err(err);
                shell.exit(1);
            } else {
                Logger.newLine(1);
                configurePackage();
            }
        },
    );
}

function configurePackage() {
    Logger.info('Configuring package.json...');
    const devDependencies: { [index: string]: string } = {};
    const scripts: { [index: string]: string } = {};

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

    const result = shell.echo(
        prettier.format(JSON.stringify({ ...packageFile, ...{ devDependencies, scripts } }), {
            parser: 'json-stringify',
        }),
    );

    if (result.code) {
        Logger.err(result.stderr);
    } else {
        result.to('package.json');
        Logger.done('Whoo! Your project is already generated by Photinia.');
    }
}
