const path = require("path");
// 自动生成对应的 html
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 清除之前旧的文件
const CleanWebpackPlugin = require("clean-webpack-plugin");

const webpack = require("webpack");

module.exports = env => {
  const isProduction = env.NODE_ENV === "production";
  console.info("isProduction:", isProduction);

  return {
    mode: isProduction ? "production" : "development",
    entry: "./src/index.js",
    output: {
      filename: "[name].[hash].js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: "/node_modules",
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env"], ["@babel/preset-react"]],
              plugins: [
                "@babel/transform-arrow-functions",
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                ["@babel/plugin-proposal-class-properties", { loose: true }],
                "@babel/plugin-syntax-dynamic-import"
              ]
            }
          }
        },
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: "",
        favicon: "./public/favicon.ico",
        template: "./public/index.html",
        minify: {
          //压缩HTML文件
          removeComments: true, //移除HTML中的注释
          collapseWhitespace: false //删除空白符与换行符
        }
      }),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ],
    devtool: isProduction ? "" : "source-map",
    devServer: {
      contentBase: path.resolve(__dirname, "dist"),
      port: 9000,
      hot: true,
      stats: 'errors-only',
      overlay: true, // 如果代码出错，会在浏览器页面弹出“浮动层”。
      // historyApiFallback: true
    },
    optimization: {
      splitChunks: {
        // 提取公共第三放插件
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all"
          }
        }
      }
    }
  };
};
