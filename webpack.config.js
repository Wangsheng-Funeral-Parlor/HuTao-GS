const { execSync } = require('child_process')
const path = require('path')
const { DefinePlugin } = require('webpack')
const WebpackObfuscator = require('webpack-obfuscator')

const { version } = require('./package.json')
const commitHash = (() => {
  try {
    return execSync('git rev-parse --short HEAD')
      .toString()
      .trim()
  } catch (err) {
    console.log(err)
    return 'unknown'
  }
})()

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './buildDev/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'build')
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    symlinks: false
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        BUILD_INFO: `"production v${version} [${commitHash}]"`,
        COMMIT_HASH: `"${commitHash}"`
      }
    }),
    new WebpackObfuscator({
      compact: true,
      controlFlowFlattening: false,
      controlFlowFlatteningThreshold: 0,
      deadCodeInjection: false,
      deadCodeInjectionThreshold: 0.3,
      debugProtection: false,
      debugProtectionInterval: 2e3,
      disableConsoleOutput: false,
      forceTransformStrings: [],
      identifierNamesCache: null,
      identifierNamesGenerator: 'hexadecimal',
      identifiersDictionary: [],
      identifiersPrefix: '',
      ignoreRequireImports: false,
      inputFileName: '',
      log: false,
      numbersToExpressions: false,
      optionsPreset: 'default',
      renameGlobals: false,
      renameProperties: false,
      renamePropertiesMode: 'safe',
      reservedNames: [],
      reservedStrings: [],
      seed: 0,
      selfDefending: true,
      simplify: true,
      sourceMap: false,
      sourceMapBaseUrl: '',
      sourceMapFileName: '',
      sourceMapMode: 'separate',
      sourceMapSourcesMode: 'sources-content',
      splitStrings: true,
      splitStringsChunkLength: 5,
      stringArray: true,
      stringArrayCallsTransform: true,
      stringArrayCallsTransformThreshold: 0.6,
      stringArrayEncoding: [],
      stringArrayIndexesType: [
        'hexadecimal-number'
      ],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 2,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 2,
      stringArrayWrappersType: 'variable',
      stringArrayThreshold: 1,
      target: 'node',
      transformObjectKeys: true,
      unicodeEscapeSequence: false
    })
  ],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'buildRel')
  }
}