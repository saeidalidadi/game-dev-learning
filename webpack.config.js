var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  // ...
  entry: {
    app: './src/app.js'
  },
  output: {
    path: 'build',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
       {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader' // creates style nodes from JS strings
            }, {
              loader: 'css-loader' // translates CSS into CommonJS
            }, {
              loader: 'sass-loader' // compiles Sass to CSS
            }
          ]
        },
        {
          test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
          use: [{
            loader: 'file-loader'
          }]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              plugins: []
            }
          }]
        },
        {
          test: /\.(jade|pug)$/,
          use: 'pug-html-loader'
        }
      ]
  },
  plugins: [
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        
          baseDir: '.',
        // browse to http://localhost:3000/ during development
        host: 'localhost',
        port: 3000,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on http://localhost:3100/)
        // through BrowserSync
        proxy: 'http://localhost:3100/'
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: false
      }
    )
  ]
}