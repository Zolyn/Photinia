import * as shell from 'shelljs';
import { PackageJSON } from './modules/utils';
import * as prettier from 'prettier';
const packageInfo: PackageJSON = JSON.parse(shell.cat('../package.json').toString());
console.log(packageInfo.scripts);
