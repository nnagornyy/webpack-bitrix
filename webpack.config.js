const path = require('path');
const fs = require('fs');
const glob = require("glob");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src'),
    }
  },
  entry: {},
  output: {
    path: path.join(__dirname),
    filename: "[name]/script.js"
  },
  plugins: [
    new MiniCssExtractPlugin({filename: '[name]/style.css',}),
    new VueLoaderPlugin(),
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          }
        }
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          {loader: "css-loader", options: {url: true}},
          {loader: "less-loader"}
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          {loader: "css-loader", options: {url: true}},
          {loader: "sass-loader"}
        ]
      },
      {
        test: /\.styl$/,
        use: [
          // {loader: MiniCssExtractPlugin.loader},
          "css-loader", // translates CSS into CommonJS
          "stylus-loader", // creates style nodes from JS strings
        ]
      },{
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          publicPath: '/local/asset',
          outputPath: './asset',
          name: '[name].[contenthash:7].[ext]',
        },
      },
    ],
  }
}

const registerStyleExt = ['.sass', '.scss', '.styl', '.less'];
const result = {};
const srcPaths = glob.sync("**/src/",{"dot":true, ignore: ["**/node_modules/**", "./node_modules/**"]});
console.log(srcPaths);

if(srcPaths.length){
  srcPaths.forEach(srcDir => {
    srcDir = './' + srcDir;
    let watchPaths = [];

    if(fileExist(srcDir + 'script.ts')){
      watchPaths.push(srcDir + 'script.ts');
    }else if(fileExist(srcDir + 'script.js')){
      watchPaths.push(srcDir + 'script.js');
    }

    registerStyleExt.forEach(ext => {
      let styleFileName = 'style' + ext;
      let styleCount = 0;
      if(fileExist(srcDir + styleFileName) && styleCount === 0){
        watchPaths.push(srcDir + styleFileName);
        styleCount++;
      }
    })

    //if any file exist
    if(watchPaths.length > 0){
      result[path.join(srcDir,'../')] = watchPaths;
    }
  })
}

module.exports.entry = result;


function fileExist(path){
  try {
    fs.accessSync(path);
    return true;
  }catch (err){
    return false;
  }
}
