const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './src/script.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: path.join(__dirname),
    compress: true,
    port: 4000,
    devMiddleware: { writeToDisk: true },
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    fallback: {
      "crypto": false
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'expose-loader',
          options: {
            exposes: ['scriptNamespace'],
          },
        }, {
          loader: 'ts-loader'
        }],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // fix "process is not defined" error:
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      // https://stackoverflow.com/a/71515171/187035
      Buffer: ['buffer', 'Buffer'],
    })
  ]
};
