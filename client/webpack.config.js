const path = require("path");
const dotenv = require("dotenv");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const env = dotenv.config({path: "./env/dev.env"}).parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});

module.exports = {
    mode: "development",
    watchOptions: {
        ignored: ['node_modules', 'scripts']
    },
    entry: {
        loader: ["@babel/polyfill", "./react/loader.jsx"]
    },
    output: {
        filename: 'bundle.js',
        chunkFilename: '[name].bundle.js',
        publicPath: "/",
        path: path.resolve(__dirname, 'build'),

    },
    resolve: {
        extensions: [".js", ".jsx", ".styl"]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {test: /[\\/]node_modules[\\/]/, name: "vendor", chunks: "all"},

            }
        }
    },
    plugins: [
        new webpack.DefinePlugin(envKeys),
        new HtmlWebPackPlugin({
            inject: true,
            template: "./public/index.html",
            filename: "./index.html",
            minify: {
                removeComments: true,
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react"]
                        }
                    }
                ],
                exclude: /node_modules/
            }, {
                test: /\.styl$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "stylus-loader"
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'images/[hash]-[name].[ext]'
                    }
                }]
            },
            {
                test: /\.(eot|ttf|woff|woff2|otf)$/,
                use: `file-loader?name=[path][hash].[ext]&context=${path.resolve(__dirname, 'client')}`
            },
        ]
    },
    devtool: "cheap-module-eval-source-map"
};
