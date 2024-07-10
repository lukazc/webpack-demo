import { merge } from "webpack-merge";
import { devServer, page, loadCSS, purgeCSS, loadImages, generateSourceMaps } from "./webpack.parts";
import { Configuration } from "webpack";

const commonConfig: Configuration = merge([
    { entry: ["./src/index.ts"] },
    page({ title: "Demo" }),
    {
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
    },
    loadCSS(),
    loadImages(15000),
]);

const productionConfig: Configuration = merge([
    purgeCSS(),
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
            }           
        }
    },
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