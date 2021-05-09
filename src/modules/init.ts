import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import * as prettier from 'prettier';
import * as semver from 'semver';

import { PackageJSON, Logger, CallbackFn, Configuration } from './utils';

shell.config.silent = true;

function initProject(config: Configuration, callback: CallbackFn) {
    let packageInfo: PackageJSON = {};
    let result = readPackage();

    if (result) {
        Logger.info('Package.json already exists, skipping...');
        Logger.newLine(1);
        callback(null, result);
    } else {
        Logger.info('Package.json does not exists, initializing...');
        Logger.newLine(1);
        const intializeResult = shell.exec(`${config.initPackageManager} init -y`, { silent: true });

        if (intializeResult.code) {
            callback(intializeResult.stderr);
        } else {
            packageInfo = readPackage() as PackageJSON;
            initGuide();
        }
    }

    function readPackage(): undefined | PackageJSON {
        const result = shell.cat('package.json');
        if (result.code) {
            Logger.warn(result.stderr);
            return undefined;
        } else {
            return JSON.parse(result.toString());
        }
    }

    function initGuide() {
        const questions = ['name', 'version', 'description', 'main', 'repository', 'author', 'license'];
        inquirer
            .prompt(
                questions.map((val) => ({
                    type: 'input',
                    name: val,
                    message: val,
                    default: packageInfo[val] ? packageInfo[val] : 'None',
                    filter: (val: string): string => (val !== 'None' ? val : ''),
                })),
            )
            .then((answers: PackageJSON): void => {
                Logger.newLine(1);
                Logger.info('Writing to package.json...');

                if (semver.valid(answers.version as string)) {
                    const mergedPackageInfo: PackageJSON = { ...packageInfo, ...answers };
                    const formattedString = shell.echo(
                        prettier.format(JSON.stringify(mergedPackageInfo), { parser: 'json-stringify' }),
                    );
                    if (formattedString.code) {
                        callback(formattedString.stderr);
                    } else {
                        formattedString.to('package.json');
                        Logger.done('Completed.');
                        Logger.newLine(1);
                        callback(null, mergedPackageInfo);
                    }
                } else {
                    callback('Cannot write package version to package.json. Is the format correct?');
                    Logger.newLine(1);
                    initGuide();
                }
            });
    }
}

export { initProject };
