process.env.BABEL_ENV = 'renderer';

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpritePlugin = require('svg-sprite-loader/plugin');
const postcssPresetEnv = require('postcss-preset-env');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ESLintPlugin = require('eslint-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const { getRendererEnvironmentDefinitions } = require('./env');
const { dependencies } = require('../package.json');

const isProduction = process.env.NODE_ENV === 'production';
/**
 * List of node_modules to include in webpack bundle
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 *
 * ESM only packages: unified remark-parse remark-gfm emoticon unist-util-visit
 */
const whiteListedModules = [
  'vue',
  'unified',
  'remark-parse',
  'remark-gfm',
  'emoticon',
  'unist-util-visit',
];

/** @type {import('webpack').Configuration} */
const rendererConfig = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  optimization: {
    emitOnErrors: false,
  },
  infrastructureLogging: {
    level: 'warn',
  },
  entry: {
    renderer: path.join(__dirname, '../src/main.ts'),
  },
  externals: [...Object.keys(dependencies || {}).filter((d) => !whiteListedModules.includes(d))],
  module: {
    rules: [
      {
        test: require.resolve(
          path.join(__dirname, '../../../packages/muya/lib/assets/libs/snap.svg-min.js'),
        ),
        use: 'imports-loader?this=>window,fix=>module.exports=0',
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            sourceMap: true,
          },
        },
      },
      {
        test: /(theme\-chalk(?:\/|\\)index|exportStyle|katex|prism[\-a-z]*|\.theme|headerFooterStyle)\.css$/,
        use: ['to-string-loader', 'css-loader'],
      },
      {
        test: /\.css$/,
        exclude:
          /(theme\-chalk(?:\/|\\)index|exportStyle|katex|prism[\-a-z]*|\.theme|headerFooterStyle)\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [postcssPresetEnv({ stage: 0 })],
              },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader',
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              publicPath: './static/',
            },
          },
          'svgo-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'images/[name].[contenthash:8][ext]',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'media/[name].[contenthash:8][ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash:8][ext]',
        },
      },
      {
        test: /\.md$/,
        type: 'asset/source',
      },
    ],
  },
  node: {
    __dirname: !isProduction,
    __filename: !isProduction,
  },
  plugins: [
    // new ESLintPlugin({
    //   cache: !isProduction,
    //   extensions: ["js", "vue"],
    //   files: ["src", "test"],
    //   exclude: ["node_modules"],
    //   emitError: false,
    //   failOnError: false,
    //   // NB: Threads must be disabled, otherwise no errors are emitted.
    //   threads: false,
    //   formatter: require("eslint-friendly-formatter"),
    //   context: path.resolve(__dirname, "../"),
    //   overrideConfigFile: ".eslintrc.js",
    // }),
    new SpritePlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
      },
      isBrowser: false,
      isDevelopment: !isProduction,
      nodeModules: !isProduction ? path.resolve(__dirname, '../node_modules') : false,
    }),
    new webpack.DefinePlugin(getRendererEnvironmentDefinitions()),
    // Use node http request instead axios's XHR adapter.
    new webpack.NormalModuleReplacementPlugin(
      /.+[\/\\]node_modules[\/\\]axios[\/\\]lib[\/\\]adapters[\/\\]xhr\.js$/,
      'http.js',
    ),
    new VueLoaderPlugin(),
  ],
  cache: false,
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron'),
    assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
    asyncChunks: true,
  },
  resolve: {
    alias: {
      main: path.join(__dirname, '../src-electron'),
      '@': path.join(__dirname, '../src'),
      api: path.join(__dirname, '../../../packages/api/src'),
      common: path.join(__dirname, '../../../packages/common'),
      muya: path.join(__dirname, '../../../packages/muya'),
      'markdown-core': path.join(__dirname, '../../../packages/markdown-core/src'),
      snapsvg: path.join(__dirname, '../../../packages/muya/lib/assets/libs/snap.svg-min.js'),
      vue$: 'vue/dist/vue.esm.js',
    },
    extensions: ['.ts', '.tsx', '.js', '.vue', '.json', '.css', '.node'],
  },
  target: 'electron-renderer',
};

/**
 * Adjust rendererConfig for development settings
 */
if (!isProduction) {
  rendererConfig.cache = { type: 'memory' };
  // NOTE: Caching between builds is currently not possible because all SVGs are invalid on second build due to svgo-loader.
  // rendererConfig.cache = {
  //   name: 'renderer-dev',
  //   type: 'filesystem'
  // }
  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      __static: `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`,
    }),
  );
}

if (
  process.env.NODE_ENV !== 'production' &&
  process.env.NODE_ENV !== 'test' &&
  !process.env.MARKTEXT_DEV_HIDE_BROWSER_ANALYZER
) {
  rendererConfig.plugins.push(new BundleAnalyzerPlugin());
}

// Fix debugger breakpoints
if (!isProduction && process.env.MARKTEXT_BUILD_VSCODE_DEBUG) {
  rendererConfig.devtool = 'inline-source-map';
}

/**
 * Adjust rendererConfig for production settings
 */
if (isProduction) {
  rendererConfig.devtool = 'nosources-source-map';
  rendererConfig.mode = 'production';
  rendererConfig.optimization.minimize = true;

  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.UNSPLASH_ACCESS_KEY': JSON.stringify(process.env.UNSPLASH_ACCESS_KEY),
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../static'),
          to: path.join(__dirname, '../dist/electron/static'),
          globOptions: {
            ignore: ['.*'],
          },
        },
        {
          from: path.resolve(__dirname, '../node_modules/codemirror/mode/*/*').replace(/\\/g, '/'),
          to: path.join(__dirname, '../dist/electron/codemirror/mode/[name]/[name][ext]'),
        },
      ],
    }),
  );
}

module.exports = rendererConfig;
