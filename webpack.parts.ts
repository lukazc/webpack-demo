import { WebpackPluginServe } from "webpack-plugin-serve";
import { Configuration } from "webpack";
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  "style-loader",
                  // Translates CSS into CommonJS
                  "css-loader",
                  // Compiles Sass to CSS
                  "sass-loader",
                ],
              },
        ],
    },
});