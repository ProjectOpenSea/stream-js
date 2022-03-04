module.exports = {
  env: {
    browser: true,
    node: true
  },
  root: true,
  reportUnusedDisableDirectives: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'prettier/prettier': 2
  }
};
