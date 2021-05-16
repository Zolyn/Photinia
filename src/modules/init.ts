import * as inquirer from 'inquirer';
import { awaitHelper, Logger, PackageJSON } from './utils';
import * as shell from 'shelljs';
import * as semver from 'semver';
import * as prettier from 'prettier';

shell.config.silent = true;

async function init() {
    let packageInfo = readPackage();
    if (packageInfo) {
        Logger.info('Package.json already exists, skipping...');
        Logger.newLine(1);
        return packageInfo;
    }

    Logger.info('Package.json does not exists, initializing...');
    Logger.newLine(1);

    const initializeResult = shell.exec(`yarn init -y`);
    if (initializeResult.code) {
        Logger.throw(initializeResult.stderr);
    }

    // 重新读取package.json
    packageInfo = readPackage();
    if (!packageInfo) {
        Logger.throw('Could not read package.json!');
    }

    const promptQuestions = ['name', 'version', 'description', 'main', 'repository', 'author', 'license'];
    const [promptErr, promptRes] = await awaitHelper(
        inquirer.prompt(
            promptQuestions.map((val) => ({
                type: 'input',
                name: val,
                message: val,
                // TS无法推断packageInfo变量是有值的，故忽略检查
                // @ts-ignore
                default: packageInfo[val] ? packageInfo[val] : 'None',
                filter: (val: string): string => (val !== 'None' ? val : ''),
            })),
        ),
    );

    if (promptErr) {
        Logger.throw(promptErr);
    }

    Logger.newLine(1);
    Logger.info('Writing to package.json...');
    if (semver.valid(promptRes.version)) {
        const mergedPackageInfo: PackageJSON = { ...packageInfo, ...promptRes };
        const formattedString = shell.echo(
            prettier.format(JSON.stringify(mergedPackageInfo), { parser: 'json-stringify' }),
        );

        if (formattedString.code) {
            Logger.throw(formattedString.stderr);
        } else {
            formattedString.to('package.json');
            Logger.done('Completed.');
            Logger.newLine(1);
            return mergedPackageInfo;
        }
    } else {
        Logger.throw('Cannot write package version to package.json. Is the format correct?');
    }

    function readPackage(): undefined | PackageJSON {
        const result = shell.cat('package.json');
        if (result.code) {
            Logger.warn(result.stderr);
            return undefined;
        } else {
            return JSON.parse(result.toString()) as PackageJSON;
        }
    }
}

export { init as initProject };
