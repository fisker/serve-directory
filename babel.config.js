module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: '0.8',
        },
        // debug: true,
        exclude: ['transform-typeof-symbol'],
        useBuiltIns: 'usage',
        modules: false,
      },
    ],
  ],
}
