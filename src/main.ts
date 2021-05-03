import * as inquirer from 'inquirer';
import * as path from 'path';
import * as findUp from 'find-up';

const result = findUp.sync('.photiniarc.js');
console.log(result);
