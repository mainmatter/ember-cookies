/* eslint-env node */

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = function () {
  return Promise.all([
    getChannelURL('release'),
    getChannelURL('beta'),
    getChannelURL('canary'),
  ]).then(urls => {
    const releaseUrl = urls[0];
    const betaUrl = urls[1];
    const canaryUrl = urls[2];
    return {
      useYarn: true,
      scenarios: [
        {
          name: 'ember-lts-3.4',
          npm: {
            devDependencies: {
              'ember-data': '~3.4.0',
              'ember-source': '~3.4.0',
            },
          },
        },
        {
          name: 'ember-lts-3.8',
          npm: {
            devDependencies: {
              'ember-data': '~3.8.0',
              'ember-source': '~3.8.0',
            },
          },
        },
        {
          name: 'ember-lts-3.12',
          npm: {
            devDependencies: {
              'ember-data': '~3.12.0',
              'ember-source': '~3.12.0',
            },
          },
        },
        {
          name: 'ember-lts-3.16',
          npm: {
            devDependencies: {
              'ember-data': '~3.16.0',
              'ember-source': '~3.16.0',
            },
          },
        },
        {
          name: 'ember-lts-3.20',
          npm: {
            devDependencies: {
              'ember-data': '~3.20.0',
              'ember-source': '~3.20.0',
            },
          },
        },
        {
          name: 'ember-lts-3.24',
          npm: {
            devDependencies: {
              'ember-data': '~3.24.0',
              'ember-source': '~3.24.0',
            },
          },
        },
        {
          name: 'ember-release',
          npm: {
            devDependencies: {
              'ember-data': 'latest',
              'ember-source': releaseUrl,
              'ember-auto-import': '^2.2.3',
              webpack: '^5.0.0',
            },
          },
        },
        {
          name: 'ember-beta',
          npm: {
            devDependencies: {
              'ember-data': 'beta',
              'ember-source': betaUrl,
              'ember-auto-import': '^2.2.3',
              webpack: '^5.0.0',
            },
          },
        },
        {
          name: 'ember-canary',
          npm: {
            devDependencies: {
              'ember-data': 'canary',
              'ember-source': canaryUrl,
              'ember-auto-import': '^2.2.3',
              webpack: '^5.0.0',
            },
          },
        },
        {
          name: 'ember-default',
          npm: {
            devDependencies: {},
          },
        },
        embroiderSafe({
          npm: {
            devDependencies: {
              'ember-auto-import': '^2.2.3',
              webpack: '^5.61.0',
            },
          },
        }),
        embroiderOptimized({
          npm: {
            devDependencies: {
              'ember-auto-import': '^2.2.3',
              webpack: '^5.61.0',
            },
          },
        }),
      ],
    };
  });
};
