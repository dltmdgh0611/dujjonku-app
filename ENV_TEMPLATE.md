# 환경 변수 설정 가이드

## .env 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 네이버 맵 API (이미 설정됨)
VITE_NAVER_MAP_CLIENT_ID=z96qowwija

# GitHub Pages 설정 (필수!)
VITE_GITHUB_USERNAME=YOUR_GITHUB_USERNAME_HERE
VITE_REPO_NAME=dujjonku-app

# Google AdMob 광고 ID (선택사항)
VITE_AD_GROUP_ID=<YOUR_AD_GROUP_ID>
```

## 중요!

`YOUR_GITHUB_USERNAME_HERE`를 실제 GitHub 로그인 ID로 변경하세요!

예시:
- GitHub 로그인 ID가 `johndoe`라면
- `VITE_GITHUB_USERNAME=johndoe`

## 확인 방법

GitHub 로그인 ID는:
1. https://github.com/settings/profile 접속
2. "Public profile" 페이지에서 확인
3. 또는 GitHub 저장소 URL에서 확인: `https://github.com/USERNAME/repo`

