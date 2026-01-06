# GitHub Pages 자동 배포 설정 가이드

## 🎯 설정 완료 항목

✅ Vite 설정 수정 완료 (`vite.config.ts`)
✅ GitHub Actions 워크플로우 생성 완료 (`.github/workflows/deploy.yml`)
✅ 10분마다 자동 크롤링 + 빌드 + 배포

---

## 📋 GitHub 저장소에서 해야 할 설정

### 1️⃣ GitHub Pages 활성화

1. GitHub 저장소로 이동: https://github.com/dltmdgh0611/dujjonku-app
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source** 섹션에서:
   - **Source**: `GitHub Actions` 선택 (Deploy from a branch가 아님!)

### 2️⃣ Actions 권한 설정

1. **Settings** → **Actions** → **General**
2. **Workflow permissions** 섹션에서:
   - ✅ **Read and write permissions** 선택
   - ✅ **Allow GitHub Actions to create and approve pull requests** 체크
3. **Save** 클릭

---

## 🚀 배포 실행

### 자동 배포
- 10분마다 자동으로 실행됩니다
- 크롤링 → 빌드 → 배포가 자동으로 진행됩니다

### 수동 배포
1. GitHub 저장소의 **Actions** 탭으로 이동
2. 왼쪽에서 **🍪 크롤링 & GitHub Pages 배포** 선택
3. 오른쪽 **Run workflow** 버튼 클릭
4. **Run workflow** 확인

### 코드 푸시 시 자동 배포
- `master` 브랜치에 푸시하면 자동으로 배포됩니다

---

## 🌐 배포된 사이트 URL

- **웹사이트**: https://dltmdgh0611.github.io/dujjonku-app/
- **데이터 API**: https://dltmdgh0611.github.io/dujjonku-app/stores.json

---

## 🔍 배포 상태 확인

1. **Actions** 탭에서 워크플로우 실행 상태 확인
2. 각 스텝의 로그를 클릭하여 상세 내역 확인
3. 배포 완료 후 위 URL로 접속하여 동작 확인

---

## 📝 참고사항

### 기존 워크플로우 파일
- `.github/workflows/crawl.yml` - 이제 사용 안 함 (삭제 가능)
- `.github/workflows/update-stores.yml` - 이제 사용 안 함 (삭제 가능)
- `.github/workflows/deploy.yml` - **새로운 통합 워크플로우** (사용 중)

### 크롤링 주기 변경
- 더 자주 실행하려면: `.github/workflows/deploy.yml`의 `cron: '*/10 * * * *'`를 수정
- 예시:
  - 5분마다: `*/5 * * * *`
  - 15분마다: `*/15 * * * *`
  - 1시간마다: `0 * * * *`

### 문제 해결
- **빌드 실패**: Actions 탭에서 로그 확인
- **페이지가 안 보임**: Settings → Pages에서 Source가 "GitHub Actions"로 되어있는지 확인
- **데이터가 업데이트 안 됨**: Actions 탭에서 워크플로우가 정상 실행되는지 확인

---

## ✅ 다음 단계

1. 위 설정을 GitHub에서 완료
2. 코드를 푸시하여 첫 배포 실행:
   ```bash
   git add .
   git commit -m "🚀 GitHub Pages 자동 배포 설정 완료"
   git push origin master
   ```
3. Actions 탭에서 배포 진행 상황 확인
4. 배포 완료 후 https://dltmdgh0611.github.io/dujjonku-app/ 접속하여 확인
