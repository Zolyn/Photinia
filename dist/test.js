"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./modules/utils");
// const templates: Template[] = [
//     {
//         name: 'a',
//         repo: 'a',
//         fileMap: new Map([
//             ['a.js','.']
//         ]),
//     },
//     {
//         name: 'b',
//         repo :'b',
//         fileMap: new Map([
//             ['b.js','.']
//         ])
//     },
//     {
//         name: 'c',
//         repo: 'c',
//         fileMap: new Map([
//             ['c.js','.']
//         ]),
//         extends: ['a','b']
//     }
// ];
//
// (async () => {
//     const [err, res] = await awaitHelper(mergeExtend(templates[2],new Map(templates.map(val => [val.name, val]))));
// })().catch((err) => Logger.err(err));
// 嵌套依赖
const obj = {
    a: {
        cont: 'a',
    },
    b: {
        cont: 'b',
        extends: ['a', 'c']
    },
    c: {
        cont: 'c',
        extends: ['d', 'b']
    },
    d: {
        cont: 'd',
    },
    e: {
        cont: 'e',
        extends: 'c'
    }
};
const searchHistory = [];
function mergeExtends(t) {
    searchHistory.push(t);
    const result = [];
    for (const val of obj[t].extends) {
        if (searchHistory.includes(val)) {
            throw `template ${t} has circular dependencies!`;
            break;
        }
        else if (obj[val].extends) {
            result.push(...mergeExtends(val));
        }
        else {
            result.push(obj[val].cont);
        }
    }
    result.push(obj[t].cont);
    return result;
}
utils_1.Logger.debug(mergeExtends('c'));
