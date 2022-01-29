import dts from "rollup-plugin-dts"

const config = {
    input: './lib/mjs/index.d.ts',
    output: {
      file: 'lib/index.umd.d.ts',
      format: 'es',
    },
    plugins: [dts()],
}

export default config