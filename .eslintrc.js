// eslint-disable-next-line no-undef
module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
};