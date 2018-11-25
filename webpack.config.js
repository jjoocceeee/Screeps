const path = require('path');

module.exports = {
  entry: "./src/loop.js",
  target: "node",
  output:
  {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    library: "Loop",
    libraryTarget: "umd"
  },
  module:
  {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
               path.resolve(__dirname, "app")
             ],
        exclude: [
               path.resolve(__dirname, "app/demo-files")
             ],
        enforce: "pre",
        enforce: "post",
        loader: "babel-loader",
        options:
        {
          presets: ["es2015"]
        },
      },
    ]
  },
  resolve:
  {
    modules: [
        "node_modules",
        path.resolve(__dirname, "app")
    ],
    extensions: [".js", ".json", ".jsx"]
  },
};
