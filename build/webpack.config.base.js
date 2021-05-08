/*
 * @Author: wanxiaodong
 * @Date: 2021-05-07 18:56:34
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2021-05-08 17:39:31
 * @Description: 
 */
const path = require('path');
module.exports = {
    target: 'web',
    entry: {
        index: './index.ts'
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '../dist'),
    },
    module: {
        rules: [
            {
                test: /.ts$/,
                use: [
                    {loader: 'babel-loader'},
                    {loader: 'ts-loader'},
                    {loader: 'tslint-loader'}
                ],
                exclude: /node_modules/
            },
            {
                test: /.js$/,
                use: [
                    {loader: 'babel-loader'}
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
}