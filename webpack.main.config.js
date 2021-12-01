/*
Copyright 2020, Staffbase GmbH and contributors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  target: "electron-main",
  entry: {
    main: ["./src/main/index.js"],
  },
  resolve: {
    extensions: [".js", ".json", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        loader: "ts-loader",
      },
      {
        test: /\.node$/,
        use: "node-loader",
      },
      {
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: {
          loader: "@marshallofsound/webpack-asset-relocator-loader",
          options: {
            outputAssetBase: "native_modules",
          },
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      {
        from: "src/main/assets/iconTemplate.png",
        to: "assets/iconTemplate.png",
      },
      {
        from: "src/main/assets/iconTemplate@2x.png",
        to: "assets/iconTemplate@2x.png",
      },
      {
        from: "src/main/config.default.json",
        to: "config.default.json",
      },
    ]),
  ],
};
