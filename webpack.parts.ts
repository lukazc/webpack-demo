import { WebpackPluginServe } from "webpack-plugin-serve";
import { MiniHtmlWebpackPlugin } from "mini-html-webpack-plugin";

interface PageArgs {
  title: string;
}

export const devServer = () => ({
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

export const page = ({ title }: PageArgs) => ({
  plugins: [new MiniHtmlWebpackPlugin({ context: { title } })],
});