const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  target: "electron-renderer",
  entry: {
    app: ["./src/index.tsx"],
    vendor: ["react", "react-dom"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "js/[name].js"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ["style-loader", "css-loader"]
      },
      {
        test: /\.png$/,
        loader: "url-loader?mimetype=image/png"
      },
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader"
      },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html")
    })
  ]
};
