const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: [
		"./src/index.js"
	],
	output: {
		filename: "./bundle.js",
	},

	devtool: "source-map",

	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['env', 'react']
				}
			}
		]
	},

	watch: NODE_ENV === 'development',

	watchOptions: {
		aggregateTimeout: 100
	},

	plugins: [
		new webpack.DefinePlugin({
			NODE_ENV: JSON.stringify(NODE_ENV)
		}),
		new webpack.ProvidePlugin({
			"react": "React",
			"react-dom": "ReactDOM"
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		}),
		new webpack.ProvidePlugin({
			_: 'lodash',
			moment: 'moment'
		})
	]
};
