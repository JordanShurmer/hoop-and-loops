const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		admin: ['./admin/main.js']
	},
	resolve: {
		extensions: ['.js', '.html']
	},
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.(html|svelte)$/,
				exclude: [/index.html/],
				use: {
					loader: 'svelte-loader',
					options: {
						skipIntroByDefault: true,
						nestedTransitions: true,
						emitCss: true,
						hotReload: true,
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			}
		]
	},
	mode: mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new HtmlWebpackPlugin({
            filename: 'admin.html',
			template: 'admin/index.html',
			chunks: ['admin']
		}),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'site/index.html',
            chunks: ['site']
        })
	],
	devtool: prod ? false: 'source-map',
	// devServer: {
	// 	contentBase: path.join(__dirname, 'public'),
	// 	port: 9000,
	//
	// }
};
