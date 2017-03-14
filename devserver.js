const webpack = require('webpack');
const WebpackHot = require('webpack-hot-middleware');
const WDM = require('webpack-dev-middleware');
const stripAnsi = require('strip-ansi');
const BS = require('browser-sync').create('Name of browser sync server');

//const Module = process.env.Module;
const Env = process.env.NODE_ENV;

module.exports = ({moduleName}) => {
  const config = require('./webpack.config')(moduleName);
  const bundler = webpack(config);
  BS.init({
    server: {
      baseDir: moduleName,
      serveStatic: ['./assets'],
      routes: {
        '/node_modules': 'node_modules'
      },
      logLevel: 'debug',
      middleware: [
        WDM(bundler, {
          // IMPORTANT: dev middleware can't access config, so we should
          // provide publicPath by ourselves
          publicPath: config.output.publicPath,

          // pretty colored output
          stats: { colors: true }

          // for other settings see
          // http://webpack.github.io/docs/webpack-dev-middleware.html
        }),
        // bundler should be the same as above
        WebpackHot(bundler)
      ]
    },
    plugins: ['bs-fullscreen-message'],
    // no need to watch '*.js' here, webpack will take care of it for us,
    // including full page reloads if HMR won't work
    files: [
      './dist/*.css',
      '**/*.html',
    ]
  });

  /**
   * Reload all devices when bundle is complete
   * or send a fullscreen error message to the browser instead
   */
  bundler.plugin('done', function(stats) {
    if(stats.hasErrors() || stats.hasWarnings()) {
      return BS.sockets.emit('fullscreen:message', {
        title: 'Webpack Error:',
        body: stripAnsi(stats.toString()),
        timeout: 100000
      });
    }
    BS.reload();
  });
};
