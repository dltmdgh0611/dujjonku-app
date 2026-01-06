import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Apps-in-Toss와 GitHub Pages 모두 호환
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
