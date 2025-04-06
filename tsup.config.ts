import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  tsconfig: './tsconfig.build.json',
  esbuildOptions(options) {
    options.alias = {
      '@controllers': './src/controllers',
      '@services': './src/services',
      '@utils': './src/utils',
    }
  },
})