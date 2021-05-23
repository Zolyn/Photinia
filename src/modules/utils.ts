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
    // 实验性功能：继承
    extends?: string[];
}

interface ChoiceBox extends copyAttr<ChoiceBox, 'files', 'devDependencies' | 'scripts'> {
    files: string[];
    [index: string]: string[];
}

interface PackageJSON {
    [index: string]: string | { [index: string]: string };
}

type ErrTypes = NodeJS.ErrnoException | string | null;

// await帮助函数，帮助捕获异常
function awaitHelper<T, U = string>(promise: Promise<T>): Promise<[U | null, T | null]> {
    return promise.then<[null, T]>((res) => [null, res]).catch<[U, null]>((err) => [err, null]);
}

// 转换二维数组至对象
function arrayToObject(arr: string[]): { [index: string]: string } {
    return Object.fromEntries(
        arr.map((val) => {
            const splitedVal = val.split('---');
            return [splitedVal[0].trim(), splitedVal[1].trim()];
        }),
    );
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

function mergeMap(map1: Template['fileMap'], map2: Template['fileMap']): Template['fileMap'] {
    const arr = [...map1];
    arr.push(...map2);
    return new Map(arr);
}

export { photinia, Configuration, Template, PackageJSON, Logger, ChoiceBox, awaitHelper, arrayToObject, mergeMap };
