const { buildEmberPlugins } = require('ember-cli-babel');

module.exports = function (api) {
  api.cache(true);

  return {
    plugins: [...buildEmberPlugins(__dirname)],
  };
};
