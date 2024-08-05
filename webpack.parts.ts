import { WebpackPluginServe } from "webpack-plugin-serve";
import { Configuration, BannerPlugin, DefinePlugin } from "webpack";
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
import { PurgeCSSPlugin } from 'purgecss-webpack-plugin';
const glob = require('glob');
import * as path from 'path';
import { GitRevisionPlugin } from "git-revision-webpack-plugin";
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

interface PageArgs {
    title: string;
    url?: string;
    chunks?: string[];
}

export const devServer = (): Configuration => ({
    watch: true,
    plugins: [
        new WebpackPluginServe({
            port: parseInt(process.env.PORT || '8080', 10),
            static: "./dist", // Expose if output.path changes
            liveReload: true,
            waitForBuild: true,
        }),
    ],
});

export const page = ({ title, url = '', chunks = [] }: PageArgs): Configuration => ({
    plugins: [new HtmlWebpackPlugin({
        title,
        publicPath: "/",
        chunks,
        filename: `${url && url + "/"}index.html`,
        context: { title },
    })],
});

export const loadCSS = (): Configuration => ({
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    // "style-loader",
                    // Extract CSS into separate files
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Add vendor prefixes to CSS
                    autoprefixCSS(),
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ],
    },
});

export const purgeCSS = (): Configuration => ({
    plugins: [
        new PurgeCSSPlugin({
            paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
            safelist: [],
            blocklist: [],
        }),
    ]
});

export const autoprefixCSS = () => ({
    loader: "postcss-loader",
    options: {
        postcssOptions: { plugins: [require("autoprefixer")()] },
    },
});

export const loadImages = (limit: number = 0): Configuration => ({
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                type: "asset/resource",
                parser: { dataUrlCondition: { maxSize: limit } },
            },
        ],
    },
});
export const generateSourceMaps = ({ type }: { type: string }): Configuration => ({
    devtool: type,
});

export const attachRevision = () => ({
    plugins: [
        new BannerPlugin({
            banner: new GitRevisionPlugin().version() || 'Unknown',
        }),
    ],
});

export const splitVendorChunks = (): Configuration => (
    {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all"
                    }
                }
            },
            runtimeChunk: { name: "runtime" },
        }
    }
);

export const minifyJavaScript = (): Configuration => ({
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                    output: {
                        comments: false,
                    }
                },
                extractComments: true,
            }),
        ],
    },
});

export const minifyCSS = ({ options } = { options: { preset: ["default"] } }) => ({
    optimization: {
        minimizer: [
            new CssMinimizerPlugin({ minimizerOptions: options }),
        ],
    },
});

export const setFreeVariable = (key, value) => {
    const env = {};
    env[key] = JSON.stringify(value);

    return {
        plugins: [new DefinePlugin(env)],
    };
};

export const generateVisualBundleAnalysis = (): Configuration => ({
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            // reportFilename: "bundle-report.html",
        })
    ]
});