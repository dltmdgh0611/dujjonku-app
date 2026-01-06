import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'dujjonkumap',
  brand: {
    displayName: '두쫀쿠맵', // 화면에 노출될 앱의 한글 이름
    primaryColor: '#FFB300', // 두쫀쿠 골드 컬러
    icon: '/dujjonku.png', // 두쫀쿠 아이콘
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'tsc && vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
