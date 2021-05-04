import { Configuration } from '../modules/utils';
import * as os from 'os';

const defaultConfig: Configuration = {
    repo: `${os.homedir()}/PhotiniaRepo`,
    initPackageManager: 'yarn',
    templates: [
        {
            name: 'TypeScript',
            files: new Map([['1', '2']]),
            devDeps: {
                '@commitlint/cli': '^12.1.1',
                '@commitlint/config-conventional': '^12.1.1',
                '@typescript-eslint/eslint-plugin': '^4.22.0',
                '@typescript-eslint/parser': '^4.22.0',
                eslint: '^7.25.0',
                'eslint-config-alloy': '^4.1.0',
                husky: '^6.0.0',
                'lint-staged': '^10.5.4',
                'sort-package-json': '^1.49.0',
                'standard-version': '^9.2.0',
                typescript: '^4.2.4',
            },
        },
    ],
};

export { defaultConfig };
