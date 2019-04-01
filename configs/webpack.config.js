const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const libConfig = {
  entry: './lib/frame.js',
  target: 'web',
  mode: 'development',
  output: {
    filename: 'index.js',
    library: 'ShaderFrame',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    libraryTarget: 'umd',
    libraryExport: 'ShaderFrame'
  },
  // externals: ['a-big-triangle', 'gl-context', 'gl-shader', 'gl-texture2d', 'glslify'],
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            '@babel/plugin-proposal-class-properties'
          ]
        }
      }
    }, {
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader']
    }]
  },
  // optimization: {
  //   minimizer: [new UglifyJsPlugin()],
  // },
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    historyApiFallback: true,
  }
}

const exampleConfig = {
  entry: './lib/example.js',
  target: 'web',
  mode: 'development',
  output: {
    filename: 'example.js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react'
          ],
          plugins: ['@babel/plugin-proposal-class-properties']
        }
      }
    }]
  }
}

const componentConfig = {
  entry: './lib/component.js',
  target: 'web',
  mode: 'development',
  // externals: {
  //   react: {
  //     commonjs: 'react',
  //     commonjs2: 'react', 
  //     amd: 'React',
  //     root: 'React'
  //   },
  //   'prop-types': {
  //     'commonjs': 'prop-types',
  //     'commonjs2': 'prop-types',
  //     'amd': 'PropTypes',
  //     'root': 'PropTypes'
  //   }
  // },
  output: {
    filename: 'component.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    // library: 'ShaderFrameComponent',      
    // libraryTarget: 'umd',
    // libraryExport: 'ShaderFrameComponent'
  },
  module: {
    noParse: /react/,
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|dist)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', '@babel/preset-env'],
          plugins: [
            '@babel/plugin-proposal-class-properties'
          ]
        }
      }
    }],
  }
}

module.exports = [libConfig, componentConfig, exampleConfig]