import { PackageJSON } from './utils';

interface BasicTemplate {
    files: Arr;
    devDeps: PackageJSON;
    scripts: PackageJSON;
}

type Arr = [string, string][];

function mixinArr(arr: Arr, mixins: Arr): Arr {
    arr.unshift(...mixins);
    return arr;
}

const mixinObj = (obj: PackageJSON, mixins: PackageJSON): PackageJSON => ({ ...obj, ...mixins });

export { mixinObj, mixinArr, Arr, BasicTemplate };
