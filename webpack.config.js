/*
 * @Author: wanxiaodong
 * @Date: 2021-05-07 18:55:19
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2021-05-08 17:39:35
 * @Description: 
 */
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const configBase = require('./build/webpack.config.base.js');

const plugins = [];
let mode = process.env.NODE_ENV || 'development'

let config = {}
if (mode === 'development') {
    config.plugins = [new HtmlPlugin({
        template: path.resolve(__dirname, './example/app.html')
    })]
    config.devServer = {
        port: 8080
    }
    configBase.entry.test = './example/test.js'
    configBase.output.filename = '[name].js'
}
module.exports = Object.assign({
    mode: mode,
    plugins
}, configBase, config)