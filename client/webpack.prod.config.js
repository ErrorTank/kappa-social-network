const path = require("path");
const dotenv = require("dotenv");
const webpack = require("webpack");
const AsyncChunkNames = require('webpack-async-chunk-names-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const env = dotenv.config({path: "./env/prod.env"}).parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});

module.exports = {
    mode: "production",

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
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: [".js", ".jsx", ".styl"]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            parallel: 4,
            terserOptions: {
                compress: {
                    inline: true
                }
            }
        })],
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,
                common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'async',
                    priority: 10,
                    reuseExistingChunk: true,
                    enforce: true
                },
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
        }),
        new AsyncChunkNames(),
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
    }
};
