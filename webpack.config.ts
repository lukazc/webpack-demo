const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");

const commonConfig = merge([
    { entry: ["./src/index.ts"] },
    parts.page({ title: "Demo" }),
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
    }
]);

const productionConfig = merge([]);

const developmentConfig = merge([
    { entry: ["webpack-plugin-serve/client"] },
    parts.devServer(),
]);

const getConfig = (env: { mode: string }): any => {
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