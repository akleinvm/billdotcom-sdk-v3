import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: false,
  minify: true,
  target: 'esnext',
  outDir: 'dist',
  splitting: false,
  treeshake: true,
  external: ['zod'],
})
