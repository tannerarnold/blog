// eslint-disable-next-line no-undef
module.exports = {
  ignorePatterns: ['dist', 'node_modules', 'src/lib/db/migrations'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
};
