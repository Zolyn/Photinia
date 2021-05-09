// Just tests
import * as inquirer from 'inquirer';
import * as shell from 'shelljs';

const packageFile = {
    name: 'package',
};

const devDependencies = 'devdeps';
const scripts = 'scrs';

const mergeObjects = {
    devDependencies,
    scripts,
};

console.log(JSON.stringify({ ...packageFile, ...{ devDependencies, scripts } }));
