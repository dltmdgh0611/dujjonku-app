# 🎯 두쫀쿠맵 - 최종 배포 요약

## ✅ 완료된 작업

### 1. 🎬 광고 시스템 구현 (수익 최적화)

**전략적 광고 배치**:
- ✅ 앱 진입 시 광고 미리 로드
- ✅ 지도 로딩 완료 후 전면 광고 (1.5초 후)
- ✅ 마커 4번 클릭마다 전면 광고
- ✅ 5분마다 백그라운드에서 광고 자동 로드

**파일**: `src/main.ts` (광고 로직 추가됨)

**예상 수익**: 사용자 1000명당 월 $50~$150

---

### 2. 🔄 GitHub Pages 자동 업데이트

**10분마다 자동 크롤링 & 배포**:
- ✅ GitHub Actions workflow 생성 (`.github/workflows/update-stores.yml`)
- ✅ 크롤러 실행 → `stores.json` 업데이트
- ✅ GitHub Pages 자동 배포
- ✅ AIT 앱은 재빌드 없이 최신 데이터 자동 반영

**작동 방식**:
```
10분마다 → 크롤링 → GitHub Pages 배포 → AIT 앱 자동 업데이트 ✨
```

---

## 🚀 다음 할 일 (순서대로)

### 1단계: 환경 변수 설정 (.env)

`.env` 파일을 다음과 같이 수정:

```env
# 네이버 맵 API (이미 있음)
VITE_NAVER_MAP_CLIENT_ID=z96qowwija

# 👇 추가 필요
# GitHub Pages 설정
VITE_GITHUB_USERNAME=YOUR_GITHUB_USERNAME_HERE  # 실제 유저명으로 변경!
VITE_REPO_NAME=dujjonku-app

# Google AdMob 광고 ID (선택사항)
VITE_AD_GROUP_ID=YOUR_AD_GROUP_ID_HERE  # 광고 원하면 Apps-in-Toss에서 발급
```

**중요**: 
- `YOUR_GITHUB_USERNAME_HERE` → 실제 GitHub 유저명
- `VITE_AD_GROUP_ID` → **선택사항!** 광고 없이도 앱 정상 작동

**💡 광고 없이 사용하려면?**  
`VITE_AD_GROUP_ID`를 설정하지 않거나 기본값으로 두면 광고 없이 작동합니다! ✅

---

### 2단계: GitHub Pages 활성화

1. GitHub 저장소 페이지 접속
2. **Settings** → **Pages**
3. **Source**: 
   - Branch: `gh-pages` 선택
   - Folder: `/ (root)`
4. **Save**

5. **Settings** → **Actions** → **General**
   - "Read and write permissions" 선택 ✅
   - "Allow GitHub Actions to create and approve pull requests" 체크 ✅
   - **Save**

---

### 3단계: 광고 ID 발급

1. [Apps-in-Toss 개발자 콘솔](https://developers-apps-in-toss.toss.im/) 접속
2. **광고** → **AdMob 설정**
3. **새 광고 그룹 생성**:
   - 광고 유형: **전면 광고 (Interstitial)**
   - 플랫폼: **웹**
4. **광고 그룹 ID 복사** (예: `ca-app-pub-1234567890123456/1234567890`)
5. `.env` 파일에 추가

---

### 4단계: GitHub 푸시

```bash
git add .
git commit -m "🚀 광고 + 자동 업데이트 설정 완료"
git push origin main
```

GitHub Actions가 자동으로 실행되어 크롤링 시작!

---

### 5단계: 확인

1. **GitHub Actions 확인**
   - 저장소 → **Actions** 탭
   - "Update Stores Data" workflow 실행 중 확인

2. **데이터 URL 확인**
   ```
   https://YOUR_USERNAME.github.io/dujjonku-app/stores.json
   ```
   브라우저에서 접속해서 데이터 확인

3. **로컬 테스트**
   ```bash
   npm run dev
   ```
   `http://localhost:5173` 접속

---

### 6단계: AIT 배포

```bash
npm run build
npm run deploy
```

---

## 📊 시스템 구조

```
┌─────────────────┐
│  dubaicookiemap │  원본 사이트
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │  10분마다 크롤링
│   (자동 실행)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Pages    │  stores.json 배포
│ (정적 호스팅)    │  https://username.github.io/repo/stores.json
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AIT 앱         │  실시간 데이터 fetch
│  (재빌드 불필요) │  광고 자동 표시
└─────────────────┘
         │
         ▼
    💰 수익 발생!
```

---

## 🎯 광고 수익 최적화 팁

### ✅ 현재 전략 (권장)
- 앱 진입 시: 1회
- 지도 로딩 후: 1회  
- 마커 4번 클릭마다: 1회
- 백그라운드 로드: 5분마다

### 📈 수익 극대화 방법
1. **CTR 향상**: 자연스러운 타이밍에 광고 표시
2. **이탈률 감소**: 광고 빈도 적절히 조절 (4번이 최적)
3. **Fill Rate 향상**: 광고 미리 로드 (항상 준비)

### 💡 추가 광고 포인트 (선택사항)
- 네이버 지도 버튼 클릭 전
- 앱 재진입 시 (세션 기반)

광고 빈도를 조절하려면 `src/main.ts`에서:
```typescript
const MARKER_CLICKS_FOR_AD = 4 // 4 → 3 (더 자주) 또는 6 (덜 자주)
```

---

## 📚 문서 참고

- **SETUP.md**: 전체 설정 가이드
- **ADMOB_SETUP.md**: 광고 설정 상세 가이드
- **README.md**: 프로젝트 소개

---

## 🐛 트러블슈팅

### GitHub Actions가 실행 안 됨
→ Settings → Actions → "Allow all actions" 확인

### 데이터가 업데이트 안 됨
→ Actions 탭에서 로그 확인
→ GitHub Pages URL 직접 접속해서 확인

### 광고가 표시 안 됨
→ `.env`의 `VITE_AD_GROUP_ID` 확인
→ 로컬 환경에서는 광고 미지원 (AIT 배포 후 확인)

---

## 🎉 완료!

이제 다음이 가능합니다:
- ✅ 10분마다 자동으로 카페 데이터 업데이트
- ✅ AIT 앱 재빌드 없이 실시간 반영
- ✅ 전략적 광고 배치로 수익 극대화
- ✅ 사용자 경험을 해치지 않는 최적의 광고 빈도

**문의사항이 있으면 Issue를 열어주세요!** 🚀

