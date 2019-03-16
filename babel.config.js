module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: '0.8',
        },
        exclude: ['transform-typeof-symbol'],
        useBuiltIns: false,
        modules: false,
      },
    ],
  ],
}
