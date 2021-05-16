import { whiteBright as chalk } from 'chalk';
import * as os from 'os';

const photinia = `${os.homedir()}/.config/photinia`;

interface Configuration {
    initPackageManager: 'npm' | 'yarn' | 'pnpm';
    templates: Template[];
}

interface Template {
    repo: string;
    name: string;
    fileMap: Map<string, string>;
    packageManager?: Configuration['initPackageManager'];
}

interface ChoiceBox {
    files: string[];
    devDependencies: string[];
    scripts: string[];
    [index: string]: string[];
}

interface PackageJSON {
    [index: string]: string | { [index: string]: string };
}

type Errno = NodeJS.ErrnoException;

type ErrTypes = Errno | string | null;

type CallbackFn = (err: ErrTypes, result?: Configuration | PackageJSON) => void;

function awaitHelper<T, U = string>(promise: Promise<T>): Promise<[U | null, T | null]> {
    return promise
        .then<[null, T]>((res) => [null, res])
        .catch<[U, null]>((err) => [err, null]);
}

// 日志打印 -- 模块
const Logger: LoggerMethods = {
    err: (msg) => console.log(`${chalk.bgRed(' ERROR ')} ${msg}`),
    warn: (msg) => console.log(`${chalk.bgRed(' WARN ')} ${msg}`),
    info: (msg) => console.log(`${chalk.bgBlue(' INFO ')} ${msg}`),
    done: (msg) => console.log(`${chalk.bgGreen(' DONE ')} ${msg}`),
    upd: (msg) => console.log(`${chalk.bgYellow(' UPDATE ')} ${msg}`),
    debug: (msg) => console.log(`${chalk.bgGray('DEBUG')}`, msg),
    newLine: (lines) => console.log('\n'.repeat(lines - 1)),
    throw: (msg) => {
        throw new Error(msg);
    },
};

interface LoggerMethods extends copyAttr<LoggerMethods, 'info', 'done' | 'upd' | 'throw'> {
    err: (msg: ErrTypes) => void;
    warn: LoggerMethods['err'];
    info: (msg: string) => void;
    debug: (msg: unknown) => void;
    newLine: (lines: number) => void;
}

type copyAttr<T, K extends keyof T, N extends string> = {
    [P in N]: T[K];
};

function overrideKey<O extends Object, T extends Object>(origin: O, target: T, keys: (keyof O)[]) {
    keys.map((val) => {
        // 允许在目标对象创建或修改键
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        target[val] = origin[val];
        return undefined;
    });
}

export {
    photinia,
    overrideKey,
    Configuration,
    Template,
    CallbackFn,
    PackageJSON,
    Errno,
    Logger,
    ChoiceBox,
    awaitHelper,
};
