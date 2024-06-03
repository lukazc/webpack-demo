import { merge } from "webpack-merge";
import { devServer, page, loadCSS } from "./webpack.parts";
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
    loadCSS()
]);

const productionConfig: Configuration = merge([]);

const developmentConfig = merge([
    { entry: ["webpack-plugin-serve/client"] },
    devServer(),
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