"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packageFile = {
    name: 'package',
};
const devDependencies = 'devdeps';
const scripts = 'scrs';
const mergeObjects = {
    devDependencies,
    scripts,
};
console.log(JSON.stringify(Object.assign(Object.assign({}, packageFile), { devDependencies, scripts })));
