import ember from 'eslint-plugin-ember';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import n from 'eslint-plugin-n';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  prettier,
  {
    ignores: [
      'node-tests/fixtures/',
      'blueprints/*/files/',
      'vendor/',
      'dist/',
      'tmp/',
      'bower_components/',
      'node_modules/',
      'coverage/',
      '!**/.*',
      '.node_modules.ember-try/',
      'bower.json.ember-try',
      'package.json.ember-try',
    ],
  },
  {
    plugins: {
      ember,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: babelParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          legacyDecorators: true,
        },
      },
    },

    rules: {},
  },
  {
    files: [
      '**/.babelrc.js',
      '**/.eslintrc.js',
      '**/.eslintrc.js',
      '**/.prettierrc.js',
      '**/addon-main.js',
      'blueprints/*/index.js',
      'config/**/*.js',
    ],

    ignores: ['src/**'],

    plugins: {
      n,
    },

    languageOptions: {
      globals: {
        ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, 'off'])),
        ...globals.node,
      },

      ecmaVersion: 6,
      sourceType: 'script',
    },
  },
];
