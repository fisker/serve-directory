export default {
  plugins: ['add-module-exports'],
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: '0.8',
        },
      },
    ],
  ],
}
