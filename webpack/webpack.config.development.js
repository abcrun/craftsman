const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const common = require('./client.config.common');

common.loaders.unshift({ test: /\.css$/, loader: 'style!css?sourceMap!postcss' });

module.exports = {
    context: common.context,
    entry: {
        bblock: './client_render.js'
    },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: 'bblock/'
    },
    module: {
        loaders: common.loaders
    },
    postcss: common.postcss,
    devtool: 'cheap-module-eval-source-map',
    plugins: common.plugins
}
