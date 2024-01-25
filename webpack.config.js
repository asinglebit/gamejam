const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
    module: {
        rules: [{ test: /\.txt$/, use: 'raw-loader' }],
    },
    mode: "development",
    plugins: [new HtmlWebpackPlugin({ template: './public/index.html' })],
};