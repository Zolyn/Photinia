import { whiteBright as chalk } from 'chalk';

interface Configuration {
    repo: string;
    initPackageManager: PackageManagers;
    templates: Template[];
}

interface Template {
    name: string;
    files: Map<string, string>;
    devDeps: PackageJSON;
    scripts: PackageJSON;
    packageManager?: PackageManagers;
}

interface CheckBox {
    files: string[];
    devDependencies: string[];
    scripts: string[];
    [index: string]: string[];
}

interface PackageJSON {
    [index: string]: string | { [index: string]: string };
}

type PackageManagers = 'npm' | 'yarn' | 'pnpm';

type Errno = NodeJS.ErrnoException;

type ErrTypes = Errno | string | null;

type CallbackFn = (err: ErrTypes, result?: Configuration) => void;

// 日志打印 -- 模块
const Logger = {
    err: (msg: ErrTypes): void => console.log(`${chalk.bgRed(' ERROR ')} ${msg}`),
    warn: (msg: ErrTypes): void => console.log(`${chalk.bgRed(' WARN ')} ${msg}`),
    info: (msg: string): void => console.log(`${chalk.bgBlue(' INFO ')} ${msg}`),
    done: (msg: string): void => console.log(`${chalk.bgGreen(' DONE ')} ${msg}`),
    upd: (msg: string): void => console.log(`${chalk.bgYellow(' UPDATE ')} ${msg}`),
    debug: (msg: any): void => console.log(`${chalk.bgGray('DEBUG')}`, msg),
    newLine: (lines: number): void => console.log('\n'.repeat(lines)),
    cls: () => console.clear(),
    str: {
        err: (msg: ErrTypes): string => `${chalk.bgRed(' ERROR ')} ${msg}`,
        warn: (msg: ErrTypes): string => `${chalk.bgRed(' WARN ')} ${msg}`,
        info: (msg: string): string => `${chalk.bgBlue(' INFO ')} ${msg}`,
        done: (msg: string): string => `${chalk.bgGreen(' DONE ')} ${msg}`,
        upd: (msg: string): string => `${chalk.bgYellow(' UPDATE ')} ${msg}`,
    },
};

export { Configuration, Template, CallbackFn, PackageJSON, Errno, Logger, CheckBox };
