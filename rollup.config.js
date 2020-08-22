import nodeResolve from '@rollup/plugin-node-resolve'

// I used @rollup/plugin-node-resolve at this place
export default {
  input: 'src/compiler/index.js',
  output: [
    {
      file: './pub/rien.umd.js',
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