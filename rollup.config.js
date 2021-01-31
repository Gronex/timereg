import postcss from 'rollup-plugin-postcss'
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  plugins: [
    postcss({
      extract: true,
      plugins: []
    }),
    nodeResolve()
  ]
}