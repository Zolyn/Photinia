"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
const defaultConfig = [
    {
        name: 'default',
        files: new Map([
            ['1', '2']
        ]),
        packageManager: 'pnpm'
    },
    {
        name: 'default2',
        files: new Map([
            [
                '3',
                '4'
            ]
        ]),
        packageManager: 'yarn'
    }
];
exports.defaultConfig = defaultConfig;
