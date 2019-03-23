module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: '6',
        },
        debug: true,
        exclude: ['transform-typeof-symbol'],
        corejs: {version: 3, proposals: true},
        useBuiltIns: false,
        // useBuiltIns: 'usage',
        modules: false,
      },
    ],
  ],
}
