const webpack = require('webpack');

module.exports = {
  webpack: function(config, env) {
    config.resolve.fallback = {
      timers: require.resolve('timers-browserify'),
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify') // Ajout du polyfill pour 'stream'
    };
    return config;
  }
};
