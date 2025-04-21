import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/core/index.ts', 'src/infra/index.ts'],
  format: ['esm'],
  outDir: 'dist',
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  target: 'es2022',
  minify: false,
  tsconfig: './tsconfig.build.json',
  esbuildOptions(options) {
    options.alias = {
      '@controllers': './src/controllers',
      '@services': './src/services',
      '@utils': './src/utils',
    }
  },
})
