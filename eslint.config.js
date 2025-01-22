import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tsEsLint from 'typescript-eslint';

export default tsEsLint.config(
  {
    ignores: ['dist', 'node_modules'],
  },
  tsEsLint.configs.recommended,
  prettierRecommended,
);
