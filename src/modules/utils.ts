import { whiteBright as chalk } from 'chalk';
import * as os from 'os';
import { join } from 'path';

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

// 含有扩展选项的模板
interface TemplateWithExtend extends Template {
    extends: string[];
}

interface ChoiceBox extends copyAttr<ChoiceBox, 'files', 'devDependencies' | 'scripts'> {
    files: string[];
    [k: string]: string[];
}

interface StringObj {
    [k: string]: string;
}

interface PackageJSON {
    devDependencies: StringObj;
    scripts: StringObj;
    [k: string]: string | StringObj;
}

type ErrTypes = NodeJS.ErrnoException | string | null;

type FileMap = Template['fileMap'];

// await帮助函数，帮助捕获异常
function awaitHelper<T, U = string>(promise: Promise<T>): Promise<[U | null, T | null]> {
    return promise.then<[null, T]>((res) => [null, res]).catch<[U, null]>((err) => [err, null]);
}

// 转换二维数组至对象
function arrayToObject(arr: string[]): StringObj {
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

interface LoggerMethods extends copyAttr<LoggerMethods, 'info', 'done' | 'upd'> {
    err: (msg: ErrTypes) => void;
    warn: LoggerMethods['err'];
    info: (msg: string) => void;
    debug: (msg: unknown) => void;
    newLine: (lines: number) => void;
    throw: (msg: string) => never;
}

/*
    复制指定对象的键的类型至新的键，类似Record<K, T>内置工具类型
    T: 目标对象
    K: 目标对象的键
    N: 新的键
 */
type copyAttr<T, K extends keyof T, N extends string> = {
    [P in N]: T[K];
};

// 合并Map
function mergeMap(map1: FileMap, map2: FileMap): FileMap {
    const arr = [...map1];
    arr.push(...map2);
    return new Map(arr);
}

// 合并对象
const mergeObj = (obj1: StringObj, obj2: StringObj): StringObj => ({ ...obj1, ...obj2 });

// 文件映射列表预处理函数
function preProcess(template: Template): FileMap {
    return new Map(
        [...template.fileMap].map((val) => {
            return [join(template.repo, val[0]), val[1]];
        }),
    );
}

export {
    photinia,
    Configuration,
    Template,
    TemplateWithExtend,
    StringObj,
    PackageJSON,
    FileMap,
    ChoiceBox,
    preProcess,
    awaitHelper,
    arrayToObject,
    mergeMap,
    mergeObj,
    Logger,
};
