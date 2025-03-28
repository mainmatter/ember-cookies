import ember from 'eslint-plugin-ember';
import prettier from 'eslint-plugin-prettier/recommended';
import qunit from 'eslint-plugin-qunit';
import globals from 'globals';
import typescriptParser from '@typescript-eslint/parser';
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

    files: ['**/*.{ts,js}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: typescriptParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          legacyDecorators: true,
        },
      },
    },

    rules: {
      'ember/no-classic-classes': 'off',
    },
  },
  {
    files: [
      '**/.babelrc.js',
      '**/.eslintrc.js',
      '**/.eslintrc.js',
      '**/.prettierrc.js',
      '**/addon-main.js',
      '**/ember-try.js',
      '**/ember-cli-build.js',
      '**/testem.js',
      'blueprints/*/index.js',
      'config/**/*.js',
    ],

    ignores: ['src/**'],

    plugins: {
      n,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 6,
      sourceType: 'script',
    },
  },
  {
    plugins: {
      qunit,
    },
    files: ['tests/**/*-test.js'],
  },
];
