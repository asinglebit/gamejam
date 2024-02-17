const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")

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
        use: [{ loader: "ts-loader" }, { loader: "ifdef-loader", options: { DEBUG: env.development } }],
        exclude: /node_modules/,
      },
      { test: /\.(json|mp3)$/, use: "url-loader" },
    ],
  },
  mode: "development",
  resolve: {
    extensions: [".ts", ".js"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "src"),
    },
    https: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ title: "Game Title", template: "./public/index.html" }),
    new CopyPlugin({
      patterns: [
        { from: "src/assets/audio", to: "assets/audio" },
        { from: "src/assets/textures", to: "assets/textures" },
      ],
    }),
  ],
})
