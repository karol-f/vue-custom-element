module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  'env': {
    'browser': true
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    "comma-dangle": ["error", "never"],
    "no-unused-expressions": ["error", { "allowShortCircuit": true }],
    "no-param-reassign": ["error", { "props": false }],
    'max-len': ['error', 105, 2, {
      ignoreUrls: true,
      ignoreComments: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    "no-underscore-dangle": ["error", { "allow": ["__vue_custom_element__", "__detached__"] }],
    "spaced-comment": ["error", "always", { "exceptions": ["/"] }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "class-methods-use-this": 0,
    "import/no-extraneous-dependencies": 0
  },
  'globals': {
    'HTMLElement': true,
    'customElements': true
  }
};
