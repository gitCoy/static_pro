
const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

const srcDir = path.resolve(process.cwd(), 'dev')

/**
 * Automatic multiple entry files
 */
const entries = function() {
	const jsDir = path.resolve(srcDir, 'script/pages')
	const entryFiles = glob.sync(jsDir + '/*.js')
	const map = {}

	for(let i = 0; i < entryFiles.length; i++) {
		const filePath = entryFiles[i]
		const fileName = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
		map[fileName] = filePath
	}
	return map
}

/**
 * @type {{entry, output: {path: (*|string), filename: string, chunkFilename: string}, mode: string}}
 */
module.exports = {
	entry: entries(),
	output: {
		path: path.join(__dirname, '../build'),
		filename: "[name].js",
		chunkFilename: "[id].chunk.js",
		libraryTarget: "var"
	},
	module: {
		rules: [
			{
				test: /\.pug$/,
				exclude: /node_modules/,
				use: [
					'html-loader',
					'pug-html-loader'
				]
			},
			{
				test: /\.scss/,
				exclude: /node_modules/,
				use: ExtractTextWebpackPlugin.extract({
					use: ['css-loader', 'sass-loader']
				})
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			minify: {
				removeAttributeQuotes:true
			},
			filename: 'index.html',
			template: path.resolve(srcDir, 'template/pages/index.pug'),
			hash: true,
			chunks:['index']
		}),
		new ExtractTextWebpackPlugin(path.join(srcDir, 'style/main.scss'))
	],
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					comments: false,
					compress: {
						warnings: false
					}
				}
			})
		]
	}
}