import { PackageJSON, MappingTable } from '../modules/utils';

interface BasicTemplate {
    files: Arr;
    devDeps: PackageJSON;
    scripts: PackageJSON;
}

type Arr = [string, string][];

function mixinMap(arr: Arr, mixins: Arr): MappingTable {
    arr.unshift(...mixins);
    return new Map(arr);
}

export { mixinMap, BasicTemplate };
