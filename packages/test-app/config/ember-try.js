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
          name: 'ember-4.0',
          npm: {
            devDependencies: {
              'ember-data': '~4.0.0',
              'ember-source': '~4.0.0',
            },
          },
        },
        {
          name: 'ember-lts-4.4',
          npm: {
            devDependencies: {
              'ember-data': '~4.4.0',
              'ember-source': '~4.4.0',
            },
          },
        },
        {
          name: 'ember-lts-4.8',
          npm: {
            devDependencies: {
              'ember-data': '~4.8.0',
              'ember-source': '~4.8.0',
            },
          },
        },
        {
          name: 'ember-4.12',
          npm: {
            devDependencies: {
              'ember-data': '~4.12.0',
              'ember-source': '~4.12.0',
            },
          },
        },
        {
          name: 'ember-release',
          npm: {
            devDependencies: {
              'ember-data': 'latest',
              'ember-source': releaseUrl,
            },
          },
        },
        {
          name: 'ember-beta',
          npm: {
            devDependencies: {
              'ember-data': 'beta',
              'ember-source': betaUrl,
            },
          },
        },
        {
          name: 'ember-canary',
          npm: {
            devDependencies: {
              'ember-data': 'canary',
              'ember-source': canaryUrl,
            },
          },
        },
        {
          name: 'ember-default',
          npm: {
            devDependencies: {},
          },
        },
        embroiderSafe(),
        embroiderOptimized(),
      ],
    };
  });
};
