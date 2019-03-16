module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: '6',
        },
        // debug: true,
        exclude: ['transform-typeof-symbol'],
        useBuiltIns: 'usage',
        modules: false,
      },
    ],
  ],
}
