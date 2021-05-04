interface Template {
    name: string;
    files: Map<string, string>;
    packageManager: 'npm' | 'yarn' | 'pnpm';
}

interface PackageJSON {
    [index: string]: string | { [index: string]: string };
}

type ErrTypes = NodeJS.ErrnoException | string | null;

type CallbackFn = (err: ErrTypes, result?: Template[]) => void;

export { Template, CallbackFn, PackageJSON };
