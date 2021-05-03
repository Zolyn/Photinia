module.exports = {
    '*.ts': ['eslint', 'prettier --write'],
    '*.{json,md,js}': ['prettier --write'],
    'package.json': ['sort-package-json'],
};
