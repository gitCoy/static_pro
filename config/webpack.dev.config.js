const path = require('path')
const merge = require('webpack-merge')
const webpackConfigBase = require('./webpack.base.config')

const webpackConfigDev = {
	devtool: 'cheap-module-eval-source-map',
	mode: 'development',
	devServer: {
		port: 3000,
		contentBase: path.join(__dirname, '../build'),
		hot: true,
		inline: true
	}
}

module.exports = merge(webpackConfigBase, webpackConfigDev)