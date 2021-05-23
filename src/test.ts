// Just tests
import * as inquirer from 'inquirer';
import * as shell from 'shelljs';
import { awaitHelper, Logger } from './modules/utils';

(async () => {
    function test() {
        throw 'Error Test';
    }
    test();
})().catch((err) => Logger.err(err));
