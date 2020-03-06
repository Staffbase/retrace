const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  target: "electron-main",
  entry: {
    main: ["./src/main/index.js"]
  },
  resolve: {
    extensions: [".js", ".json", ".ts"]
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        loader: "ts-loader"
      },
      {
        test: /\.node$/,
        use: "node-loader"
      },
      {
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: {
          loader: "@marshallofsound/webpack-asset-relocator-loader",
          options: {
            outputAssetBase: "native_modules"
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: "src/main/assets/icon_dark.png",
        to: "assets/icon_dark.png"
      },
      {
        from: "src/main/assets/icon_dark@2x.png",
        to: "assets/icon_dark@2x.png"
      },
      {
        from: "src/main/assets/icon_light.png",
        to: "assets/icon_light.png"
      },
      {
        from: "src/main/assets/icon_light@2x.png",
        to: "assets/icon_light@2x.png"
      },
      {
        from: "src/main/config.default.json",
        to: "config.default.json"
      }
    ])
  ]
};
