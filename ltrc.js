module.exports = {
    '*.js': ['eslint', 'prettier --write'],
    '*.{json,md}': ['prettier --write'],
    'package.json': ['sort-package-json'],
};
