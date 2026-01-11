# 🍪 두쫀쿠를 찾아라 (Dubai Cookie Map)

두바이 초콜릿 쫀득쿠키를 파는 카페 위치를 실시간으로 보여주는 지도 앱입니다.

## ✨ 주요 기능

- 🗺️ **네이버 맵 기반** 카페 위치 표시
- 🔄 **10분마다 자동 업데이트** (GitHub Actions)
- 📊 **실시간 재고 정보** 확인
- 💰 **광고 수익화** (선택사항)
- 📱 **Apps-in-Toss** 지원

## 🚀 빠른 시작

### 1. 필수 조건

- Node.js 18+
- Python 3.11+
- GitHub 계정

### 2. 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가:

```env
VITE_NAVER_MAP_CLIENT_ID=z96qowwija
VITE_GITHUB_USERNAME=your_github_username  # 실제 GitHub ID로 변경!
VITE_REPO_NAME=dujjonku-app
VITE_AD_GROUP_ID=<YOUR_AD_GROUP_ID>  # 선택사항
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 📦 배포

### GitHub Pages 자동 배포

1. **GitHub 저장소 생성**
   ```bash
   git add .
   git commit -m "🚀 Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/dujjonku-app.git
   git push -u origin main
   ```

2. **GitHub Pages 활성화**
   - Settings → Pages
   - Source: `gh-pages` 브랜치
   - Save

3. **GitHub Actions 권한 설정**
   - Settings → Actions → General
   - "Read and write permissions" 선택
   - Save

4. **자동 업데이트 시작**
   - 10분마다 자동으로 크롤링 및 배포됨 ✅

### Apps-in-Toss 배포

```bash
npm run build
npm run deploy
```

## 🔄 자동 업데이트 시스템

```
┌─────────────────┐
│  원본 사이트     │  dubaicookiemap.com
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │  10분마다 크롤링
│  (자동 실행)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Pages    │  stores.json 호스팅
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AIT 앱         │  실시간 데이터 fetch
└─────────────────┘
```

**장점**: 앱 재빌드 없이 데이터만 자동 업데이트!

## 📊 광고 설정 (선택사항)

자세한 내용은 [ADMOB_SETUP.md](./ADMOB_SETUP.md) 참고

- 광고 없이도 앱이 정상 작동합니다!
- 광고를 원하면 Apps-in-Toss에서 광고 ID 발급

## 📁 프로젝트 구조

```
dujjonku-app/
├── .github/workflows/
│   └── update-stores.yml    # 자동 크롤링 워크플로우
├── crawler/
│   └── crawl.py             # 크롤러 스크립트
├── public/
│   ├── dujjonku.png        # 마커 아이콘
│   └── stores.json         # 카페 데이터 (자동 생성)
├── src/
│   ├── main.ts             # 메인 로직
│   ├── style.css           # 스타일
│   └── types.ts            # 타입 정의
├── .env                    # 환경 변수
├── package.json
└── README.md
```

## 🛠️ 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run crawl` - 수동 크롤링
- `npm run deploy` - AIT 배포

## 📚 문서

- [SETUP.md](./SETUP.md) - 전체 설정 가이드
- [ADMOB_SETUP.md](./ADMOB_SETUP.md) - 광고 설정 가이드
- [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) - 배포 요약

## 🐛 트러블슈팅

### GitHub Actions가 실행되지 않아요
→ Settings → Actions → "Allow all actions" 확인

### 데이터가 업데이트되지 않아요
→ Actions 탭에서 로그 확인

### 광고가 표시되지 않아요
→ 광고 없이도 정상 작동합니다! (선택사항)

## 📄 라이선스

MIT License

## 🙏 크레딧

- 데이터 출처: [dubaicookiemap.com](https://www.dubaicookiemap.com)
- 네이버 맵 API
- Apps-in-Toss

---

**Made with ❤️ for 두쫀쿠 lovers** 🍪
