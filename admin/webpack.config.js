const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    entry: {
        client: './client.js'
    },
    output: {
        path: path.resolve(__dirname, '../public'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{loader: MiniCssExtractPlugin.loader}, 'css-loader']
            }
        ]
    },
    externals: {
        jquery: 'jQuery',
        'firebase/app': 'firebase'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
};
