/* eslint-disable func-names */
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');


const VERSION = require('./package.json').version;

module.exports = function (_, env) {
  const isProd = env.mode === 'production';
  const nodeModules = path.join(__dirname, 'node_modules');

  return {
    mode: isProd ? 'production' : 'development',
    entry: {
      'app': './src/index'
    },
    devtool: isProd ? 'source-map' : 'inline-source-map',
    output: {
      filename: isProd ? '[name].[chunkhash:5].js' : '[name].js',
      chunkFilename: '[name].[chunkhash:5].js',
      path: path.join(__dirname, 'build'),
      publicPath: '/',
      globalObject: 'self'
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      defaultRules: [],
      rules: [
        {
          oneOf: [
            {
              type: 'javascript/auto',
              resolve: {},
              parser: {
                system: false,
                requireJs: false
              }
            }
          ]
        },
        {
          test: /\.tsx?$/,
          exclude: nodeModules,
          loader: 'ts-loader'
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[hash:5].[ext]',
          },
        }
      ]
    },

    plugins: [
      // Remove old files before outputting a production build:
      isProd && new CleanWebpackPlugin({
        root: path.join(__dirname, 'build'),
        verbose: false,
        beforeEmit: true
      }),

      new ServiceWorkerWebpackPlugin({
        entry: path.join(__dirname, 'src/sw/index.ts')
      }),

      // Automatically split code into async chunks.
      // See: https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      isProd && new webpack.optimize.SplitChunksPlugin({}),

      // These plugins fix infinite loop in typings-for-css-modules-loader.
      // See: https://github.com/Jimdo/typings-for-css-modules-loader/issues/35
      new webpack.WatchIgnorePlugin([
        /(c|sc|sa)ss\.d\.ts$/
      ]),

      // For now we're not doing SSR.
      new HtmlPlugin({
        filename: path.join(__dirname, 'build/index.html'),
        template: 'src/index.html',
        minify: isProd && {
          collapseWhitespace: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeRedundantAttributes: true,
          removeComments: true
        },
        manifest: 'src/manifest.json',
        inject: 'body'
      }),

      // Inline constants during build, so they can be folded by UglifyJS.
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(VERSION),
        // We set node.process=false later in this config.
        // Here we make sure if (process && process.foo) still works:
        process: '({})'
      }),

      // Copying files via Webpack allows them to be served dynamically by `webpack serve`
      new CopyPlugin([
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/assets', to: 'assets' }
      ]),

      // For production builds, output module size analysis to build/report.html
      isProd && new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        defaultSizes: 'gzip',
        openAnalyzer: false
      }),
    ].filter(Boolean), // Filter out any falsey plugin array entries.


        // Turn off various NodeJS environment polyfills Webpack adds to bundles.
    // They're supposed to be added only when used, but the heuristic is loose
    // (eg: existence of a variable called setImmedaite in any scope)
    node: {
      console: false,
      // Keep global, it's just an alias of window and used by many third party modules:
      global: true,
      // Turn off process to avoid bundling a nextTick implementation:
      process: false,
      // Inline __filename and __dirname values:
      __filename: 'mock',
      __dirname: 'mock',
      // Never embed a portable implementation of Node's Buffer module:
      Buffer: false,
      // Never embed a setImmediate implementation:
      setImmediate: false
    },

    devServer: {
      // Any unmatched request paths will serve static files from src/*:
      contentBase: path.join(__dirname, 'src'),
      compress: true,
      // Request paths not ending in a file extension serve index.html:
      historyApiFallback: true,
      // Suppress forwarding of Webpack logs to the browser console:
      clientLogLevel: 'none',
      // Supress the extensive stats normally printed after a dev build (since sizes are mostly useless):
      stats: 'minimal',
      // Don't embed an error overlay ("redbox") into the client bundle:
      overlay: false
    }
  };
};
