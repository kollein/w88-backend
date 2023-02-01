module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { project: ['./jsconfig.json'] },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
  },
  ignorePatterns: ['src/**/*.test.js']
};
