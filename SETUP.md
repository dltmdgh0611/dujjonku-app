# 🚀 두쫀쿠맵 설정 가이드

## 📋 필수 설정

### 1. 환경 변수 설정 (.env)

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 네이버 맵 API
VITE_NAVER_MAP_CLIENT_ID=z96qowwija

# GitHub Pages 설정 (자동 업데이트용)
VITE_GITHUB_USERNAME=your_github_username
VITE_REPO_NAME=dujjonku-app

# Google AdMob 광고 그룹 ID (선택사항)
VITE_AD_GROUP_ID=your_ad_group_id_here
```

**주의**: 
- `VITE_GITHUB_USERNAME`을 실제 GitHub 유저명으로 변경하세요 (필수)
- `VITE_AD_GROUP_ID`는 **선택사항**입니다. 광고 없이도 앱이 정상 작동합니다!

**💡 팁**: 광고를 원하지 않으면 `VITE_AD_GROUP_ID`를 설정하지 마세요.

---

## 🔄 GitHub Pages 자동 업데이트 설정

### 1단계: GitHub Pages 활성화

1. GitHub 저장소 페이지 접속
2. **Settings** → **Pages**
3. **Source** 선택:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. **Save** 클릭

### 2단계: GitHub Actions 권한 설정

1. **Settings** → **Actions** → **General**
2. **Workflow permissions** 섹션에서:
   - ✅ "Read and write permissions" 선택
   - ✅ "Allow GitHub Actions to create and approve pull requests" 체크
3. **Save** 클릭

### 3단계: 첫 배포 실행

저장소에 푸시하면 자동으로 GitHub Actions가 실행됩니다:

```bash
git add .
git commit -m "🚀 Initial setup"
git push origin main
```

### 4단계: Actions 탭에서 확인

1. GitHub 저장소 → **Actions** 탭
2. "Update Stores Data" workflow 확인
3. 10분마다 자동 실행됨 ✅

---

## 📊 데이터 URL 확인

배포 후 다음 URL에서 데이터를 확인할 수 있습니다:

```
https://YOUR_USERNAME.github.io/dujjonku-app/stores.json
```

**예시**:
```
https://johndoe.github.io/dujjonku-app/stores.json
```

---

## 💰 광고 설정

자세한 내용은 `ADMOB_SETUP.md`를 참고하세요.

간단 요약:
1. Apps-in-Toss 개발자 콘솔에서 광고 그룹 ID 발급
2. `.env` 파일의 `VITE_AD_GROUP_ID` 업데이트
3. 배포

---

## 🧪 로컬 테스트

```bash
# 의존성 설치
npm install

# 크롤러 테스트
npm run crawl

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

---

## 🚢 배포

```bash
# 빌드
npm run build

# Apps-in-Toss 배포
npm run deploy
```

---

## 🔍 트러블슈팅

### GitHub Actions가 실행되지 않아요

1. **Actions 활성화 확인**
   - Settings → Actions → "Allow all actions and reusable workflows" 선택

2. **브랜치 이름 확인**
   - 기본 브랜치가 `main`인지 확인
   - `master`라면 `.github/workflows/update-stores.yml`의 브랜치 이름 변경

3. **수동 실행**
   - Actions 탭 → "Update Stores Data" → "Run workflow"

### 데이터가 업데이트되지 않아요

1. **GitHub Pages URL 확인**
   ```
   https://YOUR_USERNAME.github.io/dujjonku-app/stores.json
   ```
   브라우저에서 직접 접속해서 최신 데이터인지 확인

2. **캐시 무효화**
   - URL 뒤에 타임스탬프 쿼리 추가 (이미 코드에 적용됨)
   - `?t=${Date.now()}`

3. **Actions 로그 확인**
   - Actions 탭 → 최신 workflow → 로그 확인

### 광고가 표시되지 않아요

`ADMOB_SETUP.md` 참고

---

## 📁 프로젝트 구조

```
dujjonku-app/
├── .github/
│   └── workflows/
│       └── update-stores.yml    # 10분마다 자동 크롤링
├── crawler/
│   └── crawl.py                 # 크롤러 스크립트
├── public/
│   ├── dujjonku.png            # 마커 아이콘
│   └── stores.json             # 카페 데이터 (자동 생성)
├── src/
│   ├── main.ts                 # 메인 로직 + 광고
│   ├── style.css               # 스타일
│   └── types.ts                # 타입 정의
├── .env                        # 환경 변수 (gitignore)
├── package.json
└── vite.config.ts
```

---

## 🎯 다음 단계

1. ✅ GitHub Pages 설정
2. ✅ 환경 변수 설정
3. ✅ 광고 ID 발급 및 설정
4. ✅ 로컬 테스트
5. ✅ GitHub 푸시
6. ✅ GitHub Actions 확인
7. ✅ AIT 배포
8. 🎉 완료!

---

**문제가 있나요?** Issue를 열어주세요!

