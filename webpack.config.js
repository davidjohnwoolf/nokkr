const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

const extractSass = new ExtractTextPlugin({
    filename: production ? 'styles.[hash:10].min.css' : 'styles.[hash:10].css'
});

module.exports = {
    devtool: 'source-map',
    entry: './src/app.js',
    module: {
        rules: [
            {
                test: /\.sass$/,
                use: extractSass.extract({
                    use: [
                        { loader: 'css-loader' },
                        { loader: 'sass-loader' }
                    ]
                }),
                exclude: /node_modules/
            },
            {
                test: /\.(js|jsx)$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            }
        ],
    },
    plugins: [
        extractSass,
        new HtmlWebpackPlugin({
            template: 'src/base.html'
        })
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: production ? 'bundle.[hash:10].min.js' : 'bundle.[hash:10].js'
    }
}
