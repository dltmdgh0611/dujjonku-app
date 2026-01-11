import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  base: './', // Apps-in-Toss와 GitHub Pages 모두 호환
  server: {
    host: '0.0.0.0', // 모든 네트워크 인터페이스에서 접근 가능
    port: 5173,
    strictPort: false, // 포트가 사용 중이면 다른 포트 사용
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
