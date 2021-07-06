const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const DotenvFlow = require('dotenv-flow-webpack');
const path = require('path');

const ON_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const ON_PRODUCTION = !ON_DEVELOPMENT;
const NODE_ENV = ON_DEVELOPMENT ? 'development' : 'production';

const plugins = [];

if (ON_PRODUCTION) {
  plugins.push(new MiniCssExtractPlugin({
    linkType: 'text/css',
    ignoreOrder: true,
    filename: 'bundle.css'
  }));
}

module.exports = [{
  mode: NODE_ENV,
  target: 'browserslist',

  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  plugins: [
    new DotenvFlow({
      node_env: NODE_ENV
    }),

    ...plugins
  ],

  optimization: {
    mangleExports: 'size',
    minimize: ON_PRODUCTION,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          mangle: true,
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ]
  },

  devServer: {
    static: [
      path.join(__dirname, 'devServer'),
      {
        staticOptions: {
          // unstable schema, see: https://github.com/webpack/webpack.js.org/issues/4370
          // and https://github.com/webpack/webpack-dev-server/issues/2540
          index: 'index.html'
        },
        watch: true
      }
    ],

    client: {
      overlay: false
    },

    compress: true,
    historyApiFallback: true,
    port: 8000,
    open: {
      app: ['chromium', '--incognito']
    },
    liveReload: true
  },

  devtool: ON_DEVELOPMENT ? 'eval-cheap-module-source-map' : false,

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        loader: 'standard-loader',
        exclude: /(node_modules|public)/,
        options: {
          standard: 'standardx',
          error: ON_PRODUCTION,
          parser: '@babel/eslint-parser'
        }
      },

      {
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        options: {
          filename: '[name].js'
        }
      },

      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },

      {
        test: /\.scss$/,

        use: [
          {
            loader: ON_DEVELOPMENT ? 'style-loader' : MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
              modules: {
                namedExport: true
              }
            }
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              esModule: true,
              sourceMap: ON_DEVELOPMENT,
              import: true,
              modules: {
                namedExport: true,
                localIdentName: '[hash:base64:12]'
              }
            }
          },
          'sass-loader'
        ]
      }
    ]
  }
}];
