import { useState, useEffect, useCallback, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { css, Global } from '@emotion/react'
import type { Cafe, StoreData } from './types'

// 컴포넌트 import
import { LoadingScreen, FoundScreen, ListScreen, MapScreen } from './components'

// ============ 설정 ============
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'dltmdgh0611'
const REPO_NAME = import.meta.env.VITE_REPO_NAME || 'dujjonku-app'
const USE_GITHUB_PAGES_IN_DEV = import.meta.env.VITE_USE_GITHUB_PAGES_IN_DEV !== 'false'
const isDev = import.meta.env.DEV
const hasGitHubPages = GITHUB_USERNAME && GITHUB_USERNAME !== 'YOUR_USERNAME' && GITHUB_USERNAME !== ''
const DATA_URL = (hasGitHubPages && (isDev ? USE_GITHUB_PAGES_IN_DEV : true))
  ? `https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/stores.json`
  : './stores.json'

// 광고 설정
const AD_GROUP_ID = import.meta.env.VITE_AD_GROUP_ID || 'ait-ad-test-interstitial-id'

// ============ 타입 ============
type ViewState = 'loading' | 'found' | 'list' | 'map'
export type CafeWithDistance = Cafe & { distance: number }

// ============ AIT 모듈 상태 ============
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let getCurrentLocation: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Accuracy: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let GoogleAdMob: any = null
let aitModulesLoaded = false
let adLoaded = false

// AIT 모듈 동적 로딩
async function loadAITModules() {
  if (aitModulesLoaded) return
  try {
    const frameworkModule = await import('@apps-in-toss/web-framework')
    getCurrentLocation = frameworkModule.getCurrentLocation
    Accuracy = frameworkModule.Accuracy
    GoogleAdMob = frameworkModule.GoogleAdMob
    aitModulesLoaded = true
    console.log('✅ AIT 모듈 로드 완료')
  } catch {
    console.log('🛠️ 개발 환경: AIT Provider 없이 실행')
    aitModulesLoaded = true
  }
}

// 광고 로드 함수
function loadAd() {
  if (!GoogleAdMob || !GoogleAdMob.loadAppsInTossAdMob?.isSupported?.()) {
    console.log('📢 광고 미지원 환경')
    return
  }

  adLoaded = false
  const cleanup = GoogleAdMob.loadAppsInTossAdMob({
    options: { adGroupId: AD_GROUP_ID },
    onEvent: (event: { type: string }) => {
      if (event.type === 'loaded') {
        adLoaded = true
        console.log('📢 광고 로드 완료')
      }
    },
    onError: (error: Error) => {
      console.error('📢 광고 로드 실패:', error)
    }
  })

  return cleanup
}

// 광고 표시 함수
function showAd(onDismissed?: () => void) {
  if (!GoogleAdMob || !GoogleAdMob.showAppsInTossAdMob?.isSupported?.()) {
    console.log('📢 광고 미지원 환경')
    onDismissed?.()
    return
  }

  if (!adLoaded) {
    console.log('📢 광고가 아직 로드되지 않음')
    onDismissed?.()
    return
  }

  GoogleAdMob.showAppsInTossAdMob({
    options: { adGroupId: AD_GROUP_ID },
    onEvent: (event: { type: string }) => {
      console.log('📢 광고 이벤트:', event.type)
      if (event.type === 'dismissed') {
        // 광고 닫힘 - 다음 광고 미리 로드
        loadAd()
        onDismissed?.()
      }
    },
    onError: (error: Error) => {
      console.error('📢 광고 표시 실패:', error)
      onDismissed?.()
    }
  })
}

// ============ 유틸리티 함수 ============
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// ============ 글로벌 스타일 ============
const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }
  
  html, body, #root {
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
  }
  
  body {
    font-family: 'Toss Product Sans', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #ffffff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`

// ============ 메인 앱 컴포넌트 ============
function App() {
  const [viewState, setViewState] = useState<ViewState>('loading')
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [nearbyStores, setNearbyStores] = useState<CafeWithDistance[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [updateTime, setUpdateTime] = useState('--:--')
  const isInitialized = useRef(false)
  const listAdShown = useRef(false)
  const mapClickCount = useRef(0)

  const loadData = useCallback(async () => {
    try {
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(7)
      const url = `${DATA_URL}?t=${timestamp}&r=${random}`
      
      const res = await fetch(url, {
        cache: 'no-store',
        mode: 'cors',
        credentials: 'omit',
      })
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      
      const data: StoreData = await res.json()
      setCafes(data.d || [])
      setUpdateTime(data.t || '--:--')
      
      console.log(`✅ 데이터 로드 완료: ${data.t} (${data.d?.length || 0}개 매장)`)
      return data.d || []
    } catch (e) {
      console.error('데이터 로드 실패:', e)
      const fallback = [
        { n: '테스트카페', a: '서울시 강남구', y: 37.5219, x: 127.0299, s: 10, u: 'https://naver.me/test' },
        { n: '품절카페', a: '서울시 서초구', y: 37.5045, x: 127.0248, s: 0, u: 'https://naver.me/test2' }
      ]
      setCafes(fallback)
      return fallback
    }
  }, [])

  const getUserLocation = useCallback(async () => {
    try {
      // AIT 환경에서는 getCurrentLocation 사용
      if (getCurrentLocation && Accuracy) {
        const response = await getCurrentLocation({ accuracy: Accuracy.Balanced })
        const location = {
          lat: response.coords.latitude,
          lng: response.coords.longitude
        }
        setUserLocation(location)
        console.log(`📍 위치 확인 (AIT): ${location.lat}, ${location.lng}`)
        return location
      }
      
      // 브라우저 환경에서는 navigator.geolocation 사용
      return new Promise<{ lat: number; lng: number }>((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
              setUserLocation(location)
              console.log(`📍 위치 확인 (브라우저): ${location.lat}, ${location.lng}`)
              resolve(location)
            },
            () => {
              console.log('위치 권한 거부, 기본 위치 사용')
              const defaultLocation = { lat: 37.5665, lng: 126.9780 }
              setUserLocation(defaultLocation)
              resolve(defaultLocation)
            }
          )
        } else {
          const defaultLocation = { lat: 37.5665, lng: 126.9780 }
          setUserLocation(defaultLocation)
          resolve(defaultLocation)
        }
      })
    } catch (error) {
      console.error('위치 정보를 가져오는 데 실패했어요:', error)
      const defaultLocation = { lat: 37.5665, lng: 126.9780 }
      setUserLocation(defaultLocation)
      return defaultLocation
    }
  }, [])

  const findNearbyStores = useCallback((allCafes: Cafe[], location: { lat: number; lng: number }) => {
    const stores = allCafes
      .filter(cafe => cafe.s > 0)
      .map(cafe => ({
        ...cafe,
        distance: calculateDistance(location.lat, location.lng, cafe.y, cafe.x)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
    
    setNearbyStores(stores)
    return stores
  }, [])

  // 리스트 화면 진입 시 1초 후 광고 표시
  const handleListEnter = useCallback(() => {
    setViewState('list')
    
    // 리스트 화면 진입 시 한 번만 광고 표시
    if (!listAdShown.current) {
      setTimeout(() => {
        showAd()
        listAdShown.current = true
      }, 1000)
    }
  }, [])

  // 지도에서 마커 클릭 시 카운트 증가 및 광고 표시
  const handleMapMarkerClick = useCallback(() => {
    mapClickCount.current += 1
    console.log(`🗺️ 마커 클릭 횟수: ${mapClickCount.current}`)
    
    // 4번째 클릭마다 광고 표시
    if (mapClickCount.current % 4 === 0) {
      showAd()
    }
  }, [])

  // 초기화 - 한 번만 실행
  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    const init = async () => {
      setViewState('loading')
      
      // AIT 모듈 로드 시도
      await loadAITModules()
      
      // 광고 미리 로드
      loadAd()
      
      const loadedCafes = await loadData()
      const location = await getUserLocation()
      findNearbyStores(loadedCafes, location)
      
      // 로딩 후 찾기 완료 화면으로 전환
      setTimeout(() => {
        setViewState('found')
      }, 2000)
    }

    init()
  }, [loadData, getUserLocation, findNearbyStores])

  // 10분마다 데이터 새로고침
  useEffect(() => {
    const interval = setInterval(() => {
      loadData().then(loadedCafes => {
        if (userLocation) {
          findNearbyStores(loadedCafes, userLocation)
        }
      })
    }, 10 * 60 * 1000)

    return () => clearInterval(interval)
  }, [loadData, findNearbyStores, userLocation])

  return (
    <>
      <Global styles={globalStyles} />
      {viewState === 'loading' && <LoadingScreen />}
      {viewState === 'found' && (
        <FoundScreen 
          storeCount={nearbyStores.length} 
          onConfirm={handleListEnter} 
        />
      )}
      {viewState === 'list' && (
        <ListScreen 
          stores={nearbyStores} 
          onShowMap={() => setViewState('map')} 
        />
      )}
      {viewState === 'map' && (
        <MapScreen 
          cafes={cafes}
          userLocation={userLocation}
          updateTime={updateTime}
          onBack={() => setViewState('list')}
          onMarkerClick={handleMapMarkerClick}
        />
      )}
    </>
  )
}

// 앱 마운트
const root = createRoot(document.getElementById('root')!)
root.render(<App />)
