const path = require('path');
const fs = require('fs');

module.exports = function override(config, env) {
  if (env === 'production') {
    config.output.filename = 'static/js/[name].js';
    config.output.chunkFilename = 'static/js/[name].chunk.js';

    const cssPlugin = config.plugins.find(
      plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
    );

    if (cssPlugin) {
      cssPlugin.options.filename = 'static/css/[name].css';
      cssPlugin.options.chunkFilename = 'static/css/[name].chunk.css';
    }

    // Webpack chunk naming customization
    config.optimization.splitChunks = {
      ...config.optimization.splitChunks,
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          name: 'main.chunk',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          enforce: true,
        },
      },
    };

    config.optimization.runtimeChunk = false;
  }

  return config;
};
