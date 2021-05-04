import * as fs from 'fs';
import * as os from 'os';
import { Configuration, CallbackFn } from './utils';

function detectConfig(callback: CallbackFn): void {
    import(`${os.homedir()}/.photiniarc.js`)
        .then((module: Configuration): void => callback(null, module))
        .catch((err: NodeJS.ErrnoException): void => callback(err));
}

export { detectConfig };
