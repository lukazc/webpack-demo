import { merge } from "webpack-merge";
import { devServer, page, loadCSS, purgeCSS, loadImages, generateSourceMaps, attachRevision, minifyJavaScript, splitVendorChunks, minifyCSS, setFreeVariable, generateVisualBundleAnalysis } from "./webpack.parts";
import { Configuration } from "webpack";
const path = require('path');

const commonConfig: Configuration = merge([
    {
        entry: ["./src/index.ts"],
        output: {
            clean: true,
            chunkFilename: "[name].[contenthash].js",
            filename: "[name].[contenthash].js",
            assetModuleFilename: "[name].[contenthash][ext][query]",
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'thread-loader',
                            options: {
                                workers: 4, // Adjust the number of workers as needed
                            },
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                happyPackMode: true, // Enable happyPackMode for compatibility with thread-loader
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        stats: {
            usedExports: true,
        },
        performance: {
            hints: "error",
            maxEntrypointSize: 150000, // in bytes
            maxAssetSize: 150000, // in bytes
        },
        cache: {
            type: 'filesystem',
            buildDependencies: {
                config: [__filename], // Invalidate cache on configuration change
            },
        },
    },
    page({ title: "Demo", url: "", chunks: ["main"]}),
    loadCSS(),
    loadImages(15000),
    setFreeVariable("TITLE_TEXT", "Hello world from configuration variable"),
    { recordsPath: path.join(__dirname, "records.json") },
]);

const productionConfig: Configuration = merge([
    purgeCSS(),
    splitVendorChunks(),
    minifyJavaScript(),
    minifyCSS(),
    attachRevision(),
    generateVisualBundleAnalysis(),
]);

const developmentConfig = merge([
    { entry: ["webpack-plugin-serve/client"] },
    devServer(),
    generateSourceMaps({ type: "source-map" }),
]);

const getConfig = (env: { mode: string }): Configuration => {
    switch (env.mode) {
        case "production":
            return merge(commonConfig, productionConfig, { mode: env.mode });
        case "development":
            return merge(commonConfig, developmentConfig, { mode: env.mode });
        default:
            throw new Error(`Trying to use an unknown mode, ${env.mode}`);
    }
};

module.exports = getConfig;