export default {
  input: 'src/compiler/index.js',
  output: [
    {
      file: './pub/rien.js',
      format: 'iife',
      name: 'rien'
    },
    // {
    //   file: './index.umd.js',
    //   format: 'umd'
    // }
  ],
  plugins: [
  ]
};