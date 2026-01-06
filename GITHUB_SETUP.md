# 🚀 GitHub Pages 자동 업데이트 설정 가이드

## ⚠️ 시작하기 전에

다음 정보가 필요합니다:
- **GitHub 계정** (https://github.com)
- **GitHub username** (로그인 ID)

---

## 📋 당신이 해야 할 일 (순서대로)

### ✅ 1단계: .env 파일 설정

프로젝트 루트에 `.env` 파일을 만들고 다음 내용을 추가하세요:

```env
VITE_NAVER_MAP_CLIENT_ID=z96qowwija
VITE_GITHUB_USERNAME=YOUR_GITHUB_USERNAME_HERE
VITE_REPO_NAME=dujjonku-app
```

**중요**: `YOUR_GITHUB_USERNAME_HERE`를 실제 GitHub ID로 변경!

**GitHub username 확인 방법**:
1. https://github.com 로그인
2. 우측 상단 프로필 클릭
3. Settings → Profile
4. 또는 저장소 URL에서 확인: `https://github.com/USERNAME/repo`

**예시**:
```env
VITE_GITHUB_USERNAME=johndoe  # ← 실제 ID로 변경
```

---

### ✅ 2단계: GitHub에 저장소 생성

1. https://github.com/new 접속
2. **Repository name**: `dujjonku-app`
3. **Public** 선택 (중요!)
4. "Add a README file" **체크 해제**
5. **Create repository** 클릭

---

### ✅ 3단계: 코드 푸시

**터미널에서 실행** (순서대로):

```bash
# 1. 모든 파일 추가
git add .

# 2. 첫 커밋
git commit -m "🚀 Initial commit"

# 3. 브랜치 이름 변경
git branch -M main

# 4. GitHub 저장소 연결 (YOUR_USERNAME을 실제 GitHub ID로 변경!)
git remote add origin https://github.com/YOUR_USERNAME/dujjonku-app.git

# 5. 푸시
git push -u origin main
```

**예시**:
```bash
git remote add origin https://github.com/johndoe/dujjonku-app.git
```

---

### ✅ 4단계: GitHub Pages 활성화

1. GitHub 저장소 페이지에서:
   - **Settings** 탭 클릭
   - 왼쪽 메뉴에서 **Pages** 클릭

2. **Source** 설정:
   - Branch: `gh-pages` 선택
   - Folder: `/ (root)` 선택
   - **Save** 클릭

3. 잠시 기다리면 다음 메시지가 표시됩니다:
   ```
   Your site is live at https://YOUR_USERNAME.github.io/dujjonku-app/
   ```

---

### ✅ 5단계: GitHub Actions 권한 설정

1. **Settings** → **Actions** → **General**

2. **Workflow permissions** 섹션에서:
   - ✅ "Read and write permissions" 선택
   - ✅ "Allow GitHub Actions to create and approve pull requests" 체크
   - **Save** 클릭

---

### ✅ 6단계: 자동 크롤링 확인

1. **Actions** 탭 클릭
2. "Update Stores Data" workflow 확인
3. 첫 실행은 수동으로:
   - "Update Stores Data" 클릭
   - **Run workflow** 버튼 클릭
   - "Run workflow" 확인

4. 실행 로그에서 확인:
   ```
   ✅ 크롤링 및 배포 완료!
   📅 실행 시간: ...
   🌐 배포 URL: https://YOUR_USERNAME.github.io/dujjonku-app/stores.json
   ```

---

### ✅ 7단계: 데이터 URL 확인

브라우저에서 접속해서 JSON 데이터 확인:

```
https://YOUR_USERNAME.github.io/dujjonku-app/stores.json
```

**성공하면**: 카페 데이터가 JSON 형식으로 표시됩니다! 🎉

---

### ✅ 8단계: 앱 테스트

로컬에서 테스트:

```bash
npm run dev
```

브라우저 콘솔에서 확인:
```
📊 데이터 URL: https://YOUR_USERNAME.github.io/dujjonku-app/stores.json
🗺️ 네이버 맵 Client ID: z96qowwija
💰 광고 기능: 비활성화 ⚠️ (광고 ID 미설정)
```

---

### ✅ 9단계: Apps-in-Toss 배포

```bash
npm run build
npm run deploy
```

---

## 🎉 완료!

이제 다음이 자동으로 작동합니다:

- ✅ **10분마다** 자동 크롤링
- ✅ GitHub Pages에 `stores.json` 자동 배포
- ✅ AIT 앱이 최신 데이터 자동 반영
- ✅ **앱 재빌드 불필요!**

---

## 🔍 확인 방법

### 자동 크롤링이 작동하는지 확인:

1. **Actions** 탭 확인
   - 10분마다 새로운 workflow 실행됨
   - 녹색 체크 표시 = 성공 ✅
   - 빨간 X 표시 = 실패 ❌

2. **stores.json 업데이트 시간 확인**
   ```
   https://YOUR_USERNAME.github.io/dujjonku-app/stores.json
   ```
   - `"t":"01/07 01:30"` ← 이 시간이 10분마다 업데이트됨

3. **앱에서 확인**
   - AIT 앱 실행
   - 지도에 최신 카페 정보 표시됨

---

## 🐛 문제 해결

### "gh-pages" 브랜치가 없어요
→ Actions 탭에서 workflow가 한 번 실행되면 자동 생성됩니다

### Actions가 실행되지 않아요
→ Settings → Actions → "Allow all actions and reusable workflows" 확인

### 데이터가 업데이트되지 않아요
→ Actions 탭 → 최신 workflow → 로그 확인

### 403 Forbidden 오류
→ Settings → Actions → Workflow permissions 확인 (Write 권한 필요)

---

## 📞 도움이 필요하신가요?

- **README.md** - 전체 가이드
- **SETUP.md** - 상세 설정
- **DEPLOYMENT_SUMMARY.md** - 배포 요약

---

**🎯 핵심**: .env 파일에 실제 GitHub username만 설정하면 나머지는 자동!

