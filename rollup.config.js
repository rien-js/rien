import nodeResolve from '@rollup/plugin-node-resolve'
export default {
  input: 'src/compiler/index.js',
  output: [
    {
      file: './pub/rien.js',
      format: 'umd',
      name: 'rien',
    },
  
    // {
    //   file: './index.umd.js',
    //   format: 'umd'
    // }
  ],
  plugins: [
    nodeResolve()
  ]
};