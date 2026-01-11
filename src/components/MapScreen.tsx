import { useState, useEffect, useRef } from 'react'
import { css } from '@emotion/react'
import type { Cafe } from '../types'

const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID || 'z96qowwija'

const containerStyle = css`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`

const mapContainerStyle = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`

const mapStyle = css`
  flex: 1;
  width: 100%;
`

const backButtonStyle = css`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 100;
  padding: 10px 16px;
  background: #ffffff;
  color: #333D4B;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  
  &:active {
    background: #F2F4F6;
  }
`

const updateTimeStyle = css`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 100;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  font-size: 12px;
  color: #8B95A1;
`

const infoPanelStyle = css`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.12);
  padding: 20px;
  padding-bottom: max(20px, env(safe-area-inset-bottom));
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 100;
  
  &.show {
    transform: translateY(0);
  }
`

const panelTitleStyle = css`
  font-size: 18px;
  font-weight: 700;
  color: #191F28;
  margin-bottom: 4px;
`

const panelAddressStyle = css`
  font-size: 14px;
  color: #6B7684;
  margin-bottom: 8px;
`

const panelStockStyle = css`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
`

const panelButtonStyle = css`
  width: 100%;
  height: 52px;
  background: #3182F6;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  
  &:active {
    background: #1B64DA;
  }
`

// 네이버 지도 모바일 앱/웹으로 강제 이동 (PC 버전 절대 불가)
function openNaverMap(url: string) {
  let targetUrl = url
  
  // 1. PC map.naver.com -> 모바일 m.map.naver.com으로 변환
  if (url.includes('map.naver.com') && !url.includes('m.map.naver.com')) {
    targetUrl = url.replace('map.naver.com', 'm.map.naver.com')
  }
  
  // 2. PC place.naver.com -> 모바일 m.place.naver.com으로 변환
  if (url.includes('place.naver.com') && !url.includes('m.place.naver.com')) {
    targetUrl = url.replace('place.naver.com', 'm.place.naver.com')
  }
  
  // 3. naver.me 단축 URL인 경우 - 네이버 지도 앱 딥링크로 시도
  if (url.includes('naver.me')) {
    // 네이버 지도 앱 스키마로 먼저 시도 (앱이 설치된 경우 앱으로 이동)
    const appScheme = `nmap://place?url=${encodeURIComponent(url)}&appname=com.dujjonku.map`
    
    // 앱 열기 시도 후 실패하면 모바일 웹으로 폴백
    const startTime = Date.now()
    window.location.href = appScheme
    
    // 앱이 열리지 않으면 (500ms 후에도 페이지에 있으면) 모바일 웹으로 이동
    setTimeout(() => {
      if (Date.now() - startTime < 2000) {
        // 모바일 place 페이지로 리다이렉트 시도
        window.location.href = url
      }
    }, 500)
    return
  }
  
  // 4. 모바일 URL로 강제 리다이렉트
  window.location.href = targetUrl
}

interface MapScreenProps {
  cafes: Cafe[]
  userLocation: { lat: number; lng: number } | null
  updateTime: string
  onBack: () => void
  onMarkerClick?: () => void
}

export function MapScreen({ cafes, userLocation, updateTime, onBack, onMarkerClick }: MapScreenProps) {
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null)
  const mapRef = useRef<naver.maps.Map | null>(null)

  useEffect(() => {
    const initMap = async () => {
      if (typeof naver === 'undefined' || !naver.maps) {
        const script = document.createElement('script')
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}`
        script.async = true
        script.onload = () => createMap()
        document.head.appendChild(script)
      } else {
        createMap()
      }
    }

    const createMap = () => {
      const center = userLocation 
        ? new naver.maps.LatLng(userLocation.lat, userLocation.lng)
        : new naver.maps.LatLng(37.5665, 126.9780)

      const newMap = new naver.maps.Map('map', {
        center: center,
        zoom: 13,
        minZoom: 8,
        maxZoom: 18,
        zoomControl: false
      })

      mapRef.current = newMap

      cafes.forEach(cafe => {
        const isAvailable = cafe.s > 0
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(cafe.y, cafe.x),
          map: newMap,
          icon: {
            content: `
              <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
              ">
                <img src="./dujjonku.png" style="width: 40px; height: 40px;" alt="쿠키" />
                <div style="
                  padding: 2px 6px;
                  background: ${isAvailable ? '#3182F6' : '#9E9E9E'};
                  color: white;
                  border-radius: 10px;
                  font-size: 11px;
                  font-weight: 600;
                  margin-top: -4px;
                ">
                  ${isAvailable ? cafe.s : 0}
                </div>
              </div>
            `,
            anchor: new naver.maps.Point(20, 25)
          }
        })

        naver.maps.Event.addListener(marker, 'click', () => {
          setSelectedCafe(cafe)
          onMarkerClick?.()
        })
      })

      naver.maps.Event.addListener(newMap, 'click', () => {
        setSelectedCafe(null)
      })
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
      }
    }
  }, [cafes, userLocation])

  return (
    <div css={containerStyle}>
      <div css={mapContainerStyle}>
        <button css={backButtonStyle} onClick={onBack}>
          ← 리스트로
        </button>
        
        <div css={updateTimeStyle}>
          업데이트: {updateTime}
        </div>
        
        <div id="map" css={mapStyle} />
        
        <div css={infoPanelStyle} className={selectedCafe ? 'show' : ''}>
          {selectedCafe && (
            <>
              <div css={panelTitleStyle}>{selectedCafe.n}</div>
              <div css={panelAddressStyle}>{selectedCafe.a}</div>
              <div css={panelStockStyle} style={{ color: selectedCafe.s > 0 ? '#3182F6' : '#8B95A1' }}>
                🍪 {selectedCafe.s > 0 ? `${selectedCafe.s}개 남음` : '품절'}
              </div>
              <button css={panelButtonStyle} onClick={() => openNaverMap(selectedCafe.u)}>
                네이버 지도에서 보기 →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
