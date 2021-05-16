// Just tests
import * as inquirer from 'inquirer';
import * as shell from 'shelljs';
import { awaitHelper, Logger, overrideKey } from './modules/utils';

const a = {
    a: '1',
    b: '2',
};

const b = {
    a: 'a',
    b: 'b',
};

overrideKey(b, a, ['a', 'b']);
Logger.debug(a);
