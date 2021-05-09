import { Configuration } from '../modules/utils';
import { BasicTemplate, mixinMap } from '../modules/mixins';
import * as os from 'os';

const basicTemplate: BasicTemplate = {
    files: [
        ['basic/.commitlintrc.js', '.'],
        ['basic/.husky', '.'],
        ['basic/.lintstagedrc.js', '.'],
        ['basic/.prettierrc.js', '.'],
        ['basic/.versionrc.js', '.'],
        ['basic/LICENSE', '.'],
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
        'rel:ma': 'standard-version -r major -n',
        'rel:mi': 'standard-version -r minor -n',
        'rel:pa': 'standard-version -r patch -n',
        'prerel:a': 'standard-version -p alpha -n',
        'prerel:b': 'standard-version -p beta -n',
        'prerel:r': 'standard-version -p rc -n',
        prepare: 'husky install',
    },
};

const defaultConfig: Configuration = {
    repo: `${os.homedir()}/.photinia/repo`,
    initPackageManager: 'yarn',
    templates: [
        {
            name: 'TypeScript',
            files: mixinMap(
                [
                    ['typescript/.lintstagedrc.js', '.'],
                    ['typescript/.eslintrc.js', '.'],
                    ['typescript/.eslintignore', '.'],
                    ['typescript/.prettierignore', '.'],
                    ['typescript/.gitignore', '.'],
                    ['typescript/.husky/pre-commit', '.husky'],
                ],
                basicTemplate.files,
            ),
            devDeps: {
                '@typescript-eslint/eslint-plugin': '^4.22.0',
                '@typescript-eslint/parser': '^4.22.0',
                dpdm: '^3.6.0',
                typescript: '^4.2.4',
                ...basicTemplate.devDeps,
            },
            scripts: {
                clean: 'rm -rf ./dist',
                lint: 'eslint ./src/**/*.ts ./src/*.ts',
                format: 'prettier --write ./src/**/*.ts ./src/*.ts',
                depend: 'dpdm ./src/**/*.ts ./src/*.ts --warning false',
                build: 'yarn clean && yarn lint && yarn format && yarn depend && tsc',
                ...basicTemplate.scripts,
            },
        },
    ],
};

export { defaultConfig };
