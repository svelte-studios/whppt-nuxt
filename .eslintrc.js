module.exports = {
  root: true,
  env: { browser: true, node: true },
  parser: 'vue-eslint-parser',
  parserOptions: { parser: 'babel-eslint' },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  plugins: ['prettier', 'import'],
  rules: {
    'nuxt/no-cjs-in-config': 'off',
    'vue/no-v-html': 'off',
    'vue/no-unused-components': 'warn',
    'prettier/prettier': 'off',
    'import/no-unresolved': ['error', { commonjs: true }],
    'vue/require-prop-types': 'off',
  },
  overrides: [{ files: ['**/*.js', '**/*.vue'] }],
  settings: {
    'import/extensions': ['.js', '.vue'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.vue'],
      },
      webpack: {
        config: {
          resolve: {
            extensions: ['.js', '.vue'],
          },
        },
      },
    },
  },
};
