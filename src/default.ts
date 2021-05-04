import { Template } from './utils';

const defaultConfig: Template[] = [
    {
        name: 'default',
        files: new Map([['1', '2']]),
        packageManager: 'pnpm',
    },
    {
        name: 'default2',
        files: new Map([['3', '4']]),
        packageManager: 'yarn',
    },
];

export { defaultConfig };
