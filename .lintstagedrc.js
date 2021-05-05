module.exports = {
    '*.ts': ['eslint', 'prettier --write', 'dpdm --warning false'],
    '*.{json,md,js}': ['prettier --write'],
    'package.json': ['sort-package-json'],
};
