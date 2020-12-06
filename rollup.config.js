import postcss from 'rollup-plugin-postcss'
import path from 'path'

export default {
  plugins: [
    postcss({
      extract: true,
      plugins: []
    })
  ]
}