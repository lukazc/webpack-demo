const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");

module.exports = merge(
  { mode: "production", entry: { app: "./src/multi.ts" } },
  parts.page({ title: "Demo", chunks: ["app"]}),
  parts.page({ title: "Another", url: "another",})
);