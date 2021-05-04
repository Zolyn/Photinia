import * as fs from 'fs';
import * as os from 'os';
import { Template, CallbackFn } from './utils';

function importConfig(callback: CallbackFn): void {
    import(`${os.homedir()}/.photiniarc.js`)
        .then((module: Template[]): void => callback(null, module))
        .catch((err: NodeJS.ErrnoException): void => callback(err));
}

export { importConfig };
