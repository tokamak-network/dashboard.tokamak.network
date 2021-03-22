const path = require('path');

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
    },
  },
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8085, // CHANGE YOUR PORT HERE!
    https: true,
    hotOnly: false,
    proxy: 'http://localhost:1290',
  },
};
