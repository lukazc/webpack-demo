import { WebpackPluginServe } from "webpack-plugin-serve";
import { Configuration } from "webpack";
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
import { PurgeCSSPlugin } from 'purgecss-webpack-plugin';
const glob = require('glob');
import * as path from 'path';

interface PageArgs {
    title: string;
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

export const page = ({ title }: PageArgs): Configuration => ({
    plugins: [new HtmlWebpackPlugin({
        title
    })],
});

export const loadCSS = (): Configuration => ({
    plugins: [
        new MiniCssExtractPlugin()
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