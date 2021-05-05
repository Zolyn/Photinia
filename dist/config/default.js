"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
const mixins_1 = require("../modules/mixins");
const os = require("os");
const basicTemplate = {
    files: [
        [
            'basic/.commitlintrc.js',
            '.'
        ],
        [
            '.husky',
            '.'
        ],
        [
            'basic/.lintstagedrc.js',
            '.'
        ],
        [
            'basic/.prettierrc.js',
            '.'
        ],
        [
            'basic/.versionrc.js',
            '.'
        ],
        [
            'basic/LICENSE',
            '.'
        ]
    ],
    devDeps: {
        '@commitlint/cli': '^12.1.1',
        '@commitlint/config-conventional': '^12.1.1',
        eslint: '^7.25.0',
        'eslint-config-alloy': '^4.1.0',
        husky: '^6.0.0',
        'lint-staged': '^10.5.4',
        'sort-package-json': '^1.49.0',
        'standard-version': '^9.2.0',
    },
    scripts: {
        "rel:ma": "standard-version -r major -n",
        "rel:mi": "standard-version -r minor -n",
        "rel:pa": "standard-version -r patch -n",
        "prerel:a": "standard-version -p alpha -n",
        "prerel:b": "standard-version -p beta -n",
        "prerel:r": "standard-version -p rc -n",
        prepare: "husky install"
    }
};
const defaultConfig = {
    repo: `${os.homedir()}/PhotiniaRepo`,
    initPackageManager: 'yarn',
    templates: [
        {
            name: 'TypeScript',
            files: new Map(mixins_1.mixinArr([
                [
                    'typescript/.lintstagedrc.js',
                    '.'
                ],
                [
                    'typescript/.husky/pre-commit',
                    '.husky/pre-commit'
                ],
            ], basicTemplate.files)),
            devDeps: mixins_1.mixinObj({
                '@typescript-eslint/eslint-plugin': '^4.22.0',
                '@typescript-eslint/parser': '^4.22.0',
                dpdm: "^3.6.0",
                typescript: '^4.2.4'
            }, basicTemplate.devDeps),
            scripts: mixins_1.mixinObj({
                clean: 'rm -rf ./dist'
            }, basicTemplate.scripts)
        },
    ],
};
exports.defaultConfig = defaultConfig;
