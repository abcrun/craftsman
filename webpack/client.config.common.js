const webpack = require('webpack');
const path = require('path');

exports.context = path.join(__dirname, '../src/entry');

exports.loaders = [
    { test: /\.jsx?$/, loaders: ['babel'], exclude: /node_modules/ },
    { test: /\.(png|jpe?g|gif|svg)$/, loader: 'url-loader?name=bblock/images/[name].[hash:8].[ext]&limit=5000' },
    { test: /\.(eot|woff2?|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?name=bblock/fonts/[name].[hash:8].[ext]&limit=5000' }
]

exports.postcss = [
    require('precss'),
    require('postcss-fontpath'),
    require('autoprefixer'), 
    require('cssnano')
]

exports.plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) 
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
]
