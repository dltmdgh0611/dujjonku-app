// 최우선 로그 - 스크립트 로드 확인
console.log('🚀 main.ts 로드됨!')

import './style.css'
import type { Cafe, StoreData } from './types'
import { GoogleAdMob } from '@apps-in-toss/web-framework'

// ============ 설정 ============
// 데이터 URL 설정
// 1. GitHub Pages가 설정되어 있으면 그것 사용 (자동 업데이트)
// 2. 없으면 로컬 stores.json 사용
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || ''
const REPO_NAME = import.meta.env.VITE_REPO_NAME || 'dujjonku-app'

// GitHub Pages URL이 제대로 설정되어 있는지 확인
const hasGitHubPages = GITHUB_USERNAME && GITHUB_USERNAME !== 'YOUR_USERNAME' && GITHUB_USERNAME !== ''

const DATA_URL = hasGitHubPages
  ? `https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/stores.json`
  : './stores.json' // 로컬 파일 (빌드에 포함됨)

console.log('📊 데이터 URL:', DATA_URL)
console.log('🌐 GitHub Pages:', hasGitHubPages ? '활성화 ✅' : '비활성화 (로컬 데이터 사용)')

// 광고 그룹 ID (실제 값으로 교체 필요)
const AD_GROUP_ID = import.meta.env.VITE_AD_GROUP_ID || '<YOUR_AD_GROUP_ID>'

// 광고 ID 유효성 체크
function isAdIdValid(): boolean {
  if (!AD_GROUP_ID || AD_GROUP_ID === '<YOUR_AD_GROUP_ID>') {
    return false
  }
  // ca-app-pub-* 형식 체크
  return AD_GROUP_ID.startsWith('ca-app-pub-')
}

const AD_ENABLED = isAdIdValid()

// ============ 환경 변수 ============
// 웹에서는 클라이언트 ID만 사용 (클라이언트 시크릿은 서버 사이드 API용)
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID || 'z96qowwija'

console.log('🗺️ 네이버 맵 Client ID:', NAVER_CLIENT_ID)
console.log('💰 광고 기능:', AD_ENABLED ? '활성화 ✅' : '비활성화 ⚠️ (광고 ID 미설정)')

// ============ 전역 변수 ============
let map: naver.maps.Map
let markers: naver.maps.Marker[] = []
let cafes: Cafe[] = []

// 광고 관련 변수
let isAdLoaded = false
let markerClickCount = 0
const MARKER_CLICKS_FOR_AD = 4 // 4번 클릭마다 광고
let adCleanup: (() => void) | null = null

// ============ DOM 요소 ============
const $app = document.getElementById('app')!

// ============ 렌더링 ============
function render() {
  $app.innerHTML = `
    <div class="loading" id="loading">
      <div class="loading-icon">🍪</div>
      <div class="loading-text">두쫀쿠 찾는 중...</div>
    </div>

    <div id="map"></div>
    
    <div class="info-panel" id="infoPanel">
      <div class="info-panel-content">
        <div class="info-panel-name" id="panelName">가게를 선택하세요</div>
        <div class="info-panel-address" id="panelAddress"></div>
        <button class="info-panel-btn" id="panelBtn" style="display: none;">
          네이버 지도에서 보기 →
        </button>
      </div>
    </div>
  `
}

// ============ 광고 기능 ============

/**
 * 광고 미리 로드 (백그라운드)
 * 5분마다 자동으로 광고를 미리 준비
 */
function loadAdInBackground() {
  // 광고 비활성화 시 스킵
  if (!AD_ENABLED) {
    return
  }

  if (!GoogleAdMob.loadAppsInTossAdMob.isSupported()) {
    console.log('📢 광고 미지원 환경')
    return
  }

  try {
    console.log('📢 광고 로딩 시작...')
    
    adCleanup = GoogleAdMob.loadAppsInTossAdMob({
      options: {
        adGroupId: AD_GROUP_ID,
      },
      onEvent: (event) => {
        if (event.type === 'loaded') {
          console.log('✅ 광고 로드 완료')
          isAdLoaded = true
          if (adCleanup) adCleanup()
        }
      },
      onError: (error) => {
        console.error('❌ 광고 로드 실패:', error)
        isAdLoaded = false
        if (adCleanup) adCleanup()
      },
    })
  } catch (error) {
    console.error('❌ 광고 로드 오류:', error)
    isAdLoaded = false
  }
}

/**
 * 광고 표시 (수익 최대화 전략)
 * @param reason 광고 표시 이유 (로그용)
 */
function showAd(reason: string) {
  // 광고 비활성화 시 스킵
  if (!AD_ENABLED) {
    return
  }

  if (!GoogleAdMob.showAppsInTossAdMob.isSupported()) {
    console.log('📢 광고 표시 미지원')
    return
  }

  if (!isAdLoaded) {
    console.log('📢 광고가 아직 로드되지 않음')
    loadAdInBackground() // 다음을 위해 미리 로드
    return
  }

  try {
    console.log(`📢 광고 표시: ${reason}`)

    GoogleAdMob.showAppsInTossAdMob({
      options: {
        adGroupId: AD_GROUP_ID,
      },
      onEvent: (event) => {
        console.log('광고 이벤트:', event.type)
        
        // 광고 종료 후 다음 광고 미리 로드
        // 모든 이벤트 후 재로드 (광고가 끝났다는 의미)
        isAdLoaded = false
        setTimeout(() => loadAdInBackground(), 1000)
      },
      onError: (error) => {
        console.error('❌ 광고 표시 실패:', error)
        isAdLoaded = false
        loadAdInBackground() // 재시도
      },
    })

    isAdLoaded = false // 표시했으므로 로드 상태 초기화
  } catch (error) {
    console.error('❌ 광고 표시 오류:', error)
    isAdLoaded = false
  }
}

/**
 * 마커 클릭 시 광고 체크
 * 4번 클릭마다 광고 표시 (수익과 UX 밸런스)
 */
function checkAndShowAdOnMarkerClick() {
  markerClickCount++
  
  if (markerClickCount >= MARKER_CLICKS_FOR_AD) {
    showAd(`마커 ${MARKER_CLICKS_FOR_AD}회 클릭`)
    markerClickCount = 0 // 카운터 리셋
  }
}

/**
 * 주기적 광고 로드 (5분마다)
 * 항상 준비된 광고를 유지
 */
function startPeriodicAdLoad() {
  // 광고 비활성화 시 스킵
  if (!AD_ENABLED) {
    return
  }

  setInterval(() => {
    if (!isAdLoaded) {
      loadAdInBackground()
    }
  }, 5 * 60 * 1000) // 5분
}

// ============ 네이버 맵 스크립트 로드 ============
function loadNaverMapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 이미 로드되어 있으면 바로 resolve
    if (typeof naver !== 'undefined' && naver.maps) {
      resolve()
      return
    }

    // 환경 변수 체크
    if (!NAVER_CLIENT_ID) {
      reject(new Error('네이버 맵 API 클라이언트 ID가 설정되지 않았습니다.'))
      return
    }

    // 스크립트 동적 로드 (웹에서는 클라이언트 ID만 사용)
    const script = document.createElement('script')
    // 최신 API: ncpKeyId, 구버전: ncpClientId
    const url = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}`
    console.log('🔗 네이버 맵 API URL:', url)
    script.src = url
    script.async = true
    script.onload = () => {
      if (typeof naver !== 'undefined' && naver.maps) {
        resolve()
      } else {
        reject(new Error('네이버 맵 API 로드 실패'))
      }
    }
    script.onerror = () => {
      reject(new Error('네이버 맵 API 스크립트 로드 실패'))
    }
    document.head.appendChild(script)
  })
}

// ============ 초기화 ============
async function init() {
  render()

  // 🎯 전략 1: 앱 진입 시 광고 미리 로드
  loadAdInBackground()
  
  // 주기적 광고 로드 시작 (5분마다)
  startPeriodicAdLoad()

  // 네이버 맵 스크립트 로드
  try {
    await loadNaverMapScript()
  } catch (error) {
    console.error('네이버 맵 API 로드 실패:', error)
    showError('네이버 맵 API 로드 실패', error instanceof Error ? error.message : '알 수 없는 오류')
    return
  }

  // 네이버 맵 체크
  if (typeof naver === 'undefined' || !naver.maps) {
    showError('네이버 맵 API 키 필요', '.env 파일에 VITE_NAVER_MAP_CLIENT_ID와 VITE_NAVER_MAP_CLIENT_SECRET을 설정해주세요')
    return
  }

  // 지도 초기화
  map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(37.5665, 126.9780),
    zoom: 11,
    minZoom: 8,
    maxZoom: 18,
    zoomControl: false
  })

  // 지도 클릭시 정보 패널 닫기
  naver.maps.Event.addListener(map, 'click', () => {
    const $panel = document.getElementById('infoPanel')
    if ($panel) {
      $panel.classList.remove('show')
    }
  })

  // 데이터 로드
  await loadData()

  document.getElementById('loading')?.classList.add('hidden')
  
  // 🎯 전략 2: 지도 로딩 완료 후 광고 표시 (자연스러운 전환)
  setTimeout(() => {
    showAd('앱 진입 - 지도 로딩 완료')
  }, 1500) // 1.5초 후 표시 (로딩 애니메이션 후)
}

// ============ 에러 표시 ============
function showError(title: string, desc: string) {
  const $loading = document.getElementById('loading')
  if ($loading) {
    $loading.innerHTML = `
      <div class="error">
        <div class="error-icon">🗺️</div>
        <div class="error-title">${title}</div>
        <div class="error-desc">${desc}</div>
      </div>
    `
  }
}

// ============ 데이터 로드 ============
async function loadData() {
  try {
    const res = await fetch(`${DATA_URL}?t=${Date.now()}`)
    const data: StoreData = await res.json()

    cafes = data.d || []

    // UI 업데이트
    const $updateTime = document.getElementById('updateTime')
    const $availableCount = document.getElementById('availableCount')
    const $soldoutCount = document.getElementById('soldoutCount')

    if ($updateTime) $updateTime.textContent = `업데이트: ${data.t || '--:--'}`
    if ($availableCount) $availableCount.textContent = String(data.a || 0)
    if ($soldoutCount) $soldoutCount.textContent = String((data.c || 0) - (data.a || 0))

    renderMarkers()
  } catch (e) {
    console.error('데이터 로드 실패:', e)
    // 로컬 테스트용 샘플
    cafes = [
      { n: '테스트카페', a: '서울시 강남구', y: 37.5219, x: 127.0299, s: 10, u: 'https://naver.me/test' },
      { n: '품절카페', a: '서울시 서초구', y: 37.5045, x: 127.0248, s: 0, u: 'https://naver.me/test2' }
    ]
    renderMarkers()
  }
}

// ============ 마커 렌더링 ============
function renderMarkers() {
  // 기존 마커 제거
  markers.forEach(m => m.setMap(null))
  markers = []

  cafes.forEach(cafe => {
    const isAvailable = cafe.s > 0

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(cafe.y, cafe.x),
      map: map,
      icon: {
        content: `
          <div class="custom-marker">
            <img src="/dujjonku.png" class="marker-icon" alt="쿠키" />
            <div class="marker-count ${isAvailable ? 'available' : 'soldout'}">
              ${isAvailable ? cafe.s : 0}
            </div>
          </div>
        `,
        anchor: new naver.maps.Point(25, 25) // 아이콘(50px)의 중심 기준
      }
    })

    // 클릭 이벤트
    naver.maps.Event.addListener(marker, 'click', () => {
      showInfo(cafe)
      
      // 🎯 전략 3: 마커 4번 클릭마다 광고 (탐색 중 적절한 빈도)
      checkAndShowAdOnMarkerClick()
    })

    markers.push(marker)
  })
}

// ============ 하단 정보 패널 ============
function showInfo(cafe: Cafe) {
  const $panel = document.getElementById('infoPanel')
  const $panelName = document.getElementById('panelName')
  const $panelAddress = document.getElementById('panelAddress')
  const $panelBtn = document.getElementById('panelBtn') as HTMLButtonElement

  if ($panel && $panelName && $panelAddress && $panelBtn) {
    $panelName.textContent = cafe.n
    $panelAddress.textContent = cafe.a
    $panelAddress.style.display = cafe.a ? 'block' : 'none'
    $panelBtn.style.display = 'block'
    $panelBtn.onclick = () => {
      window.open(cafe.u, '_blank')
    }
    $panel.classList.add('show')
  }
}

// ============ 시작 ============
document.addEventListener('DOMContentLoaded', init)
