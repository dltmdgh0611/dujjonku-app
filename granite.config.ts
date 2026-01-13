import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'dujjonkumap',
  brand: {
    displayName: '두쫀쿠를 찾아라', // 화면에 노출될 앱의 한글 이름
    primaryColor: '#3182F6', // 토스 블루
    icon: 'https://raw.githubusercontent.com/dltmdgh0611/dujjonku-app/refs/heads/main/dujjonku.png', // 두쫀쿠 아이콘 (네비게이션바 타이틀 옆에 표시)
    bridgeColorMode: 'basic',
  },
  web: {
    host: '0.0.0.0', // 모든 네트워크 인터페이스에서 접근 가능
    port: 8081, // Granite 서버 포트 (명시적으로 설정 필요)
    commands: {
      dev: 'vite --host --port 5173', // Vite는 5173에서 실행, Granite가 프록시
      build: 'tsc && vite build',
    },
  },
  permissions: [
    {
      name: 'geolocation',
      access: 'access',
    },
  ],
  outdir: 'dist',
  navigationBar: {
    withBackButton: true,
    withHomeButton: false,
  },
});
