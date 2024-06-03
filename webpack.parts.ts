import { WebpackPluginServe } from "webpack-plugin-serve";
import { MiniHtmlWebpackPlugin } from "mini-html-webpack-plugin";
import { Configuration } from "webpack";

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
    plugins: [new MiniHtmlWebpackPlugin({ context: { title } })],
});

export const loadCSS = (): Configuration => ({
    module: {
        rules: [
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
        ],
    },
});