const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = (env) => ({
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          { loader: "ts-loader" }, 
          { loader: "ifdef-loader", options: { DEBUG: env.development } } 
        ],
        exclude: /node_modules/,
      },
      { test: /\.tmx$/, use: "url-loader" },
      { test: /\.tsx$/, use: "url-loader" },
    ],
  },
  mode: "development",
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })],
})
