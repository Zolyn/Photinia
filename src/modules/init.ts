import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import * as prettier from 'prettier';

import { PackageJSON, Logger, CallbackFn, Configuration } from './utils';

function initProject(config: Configuration, callback: CallbackFn) {
    let packageInfo: PackageJSON = {};

    Logger.info('Initializing package.json...');

    if (!shell.exec(`${config.initPackageManager} init -y`, { silent: true }).code) {
        Logger.done('Completed.');
        packageInfo = JSON.parse(shell.cat('package.json').toString());
        initGuide();
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
            .then((answers): void => {
                Logger.info('Writing to package.json...');
                const formattedString = shell.echo(
                    prettier.format(JSON.stringify({ ...packageInfo, ...answers }), { parser: 'json-stringify' }),
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

export { initProject };
