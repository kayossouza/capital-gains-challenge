const path = require('path');

function resolvePath(filePath) {
  return path.resolve(__dirname, filePath).replace(/\\/g, '/');
}

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [resolvePath('./tsconfig.json'), resolvePath('./.eslintrc.js')],
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-type-arguments': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
  },
};