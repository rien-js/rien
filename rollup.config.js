export default {
  input: 'src/compiler/index.js',
  output: [
    {
      file: './index.js',
      format: 'cjs'
    },
    // {
    //   file: './index.umd.js',
    //   format: 'umd'
    // }
  ],
  plugins: [
  ]
};