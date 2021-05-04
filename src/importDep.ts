import * as shell from 'shelljs';
import { PackageJSON } from './modules/utils';
import * as prettier from 'prettier';
const packageInfo: PackageJSON = JSON.parse(shell.cat('../package.json').toString());
shell.echo(prettier.format(JSON.stringify(packageInfo), { parser: 'json-stringify' })).to('pkg.json');
