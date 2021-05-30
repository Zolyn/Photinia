/// <reference types="node" />
declare const photinia: string;
interface Configuration {
    initPackageManager: 'npm' | 'yarn' | 'pnpm';
    templates: Template[];
}
interface Template {
    repo: string;
    name: string;
    fileMap: Map<string, string>;
    packageManager?: Configuration['initPackageManager'];
    extends?: string[];
}
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
declare type ErrTypes = NodeJS.ErrnoException | string | null;
declare type FileMap = Template['fileMap'];
declare function awaitHelper<T, U = string>(promise: Promise<T>): Promise<[U | null, T | null]>;
declare function arrayToObject(arr: string[]): StringObj;
declare const Logger: LoggerMethods;
interface LoggerMethods extends copyAttr<LoggerMethods, 'info', 'done' | 'upd'> {
    err: (msg: ErrTypes) => void;
    warn: LoggerMethods['err'];
    info: (msg: string) => void;
    debug: (msg: unknown) => void;
    newLine: (lines: number) => void;
    throw: (msg: string) => never;
}
declare type copyAttr<T, K extends keyof T, N extends string> = {
    [P in N]: T[K];
};
declare function mergeMap(map1: FileMap, map2: FileMap): FileMap;
declare const mergeObj: (obj1: StringObj, obj2: StringObj) => StringObj;
declare function preProcess(template: Template): FileMap;
export { photinia, Configuration, Template, TemplateWithExtend, StringObj, PackageJSON, FileMap, ChoiceBox, preProcess, awaitHelper, arrayToObject, mergeMap, mergeObj, Logger, };
//# sourceMappingURL=utils.d.ts.map