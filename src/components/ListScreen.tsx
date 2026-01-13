import { css } from '@emotion/react'
import type { Cafe } from '../types'

const containerStyle = css`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
`

const topSectionStyle = css`
  padding: 40px 20px 20px;
`

const titleStyle = css`
  font-size: 22px;
  font-weight: 700;
  color: #191F28;
  line-height: 1.4;
`

const listStyle = css`
  padding: 0 20px;
`

const listItemStyle = css`
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #F2F4F6;
  gap: 12px;
`

const iconStyle = css`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const contentsStyle = css`
  flex: 1;
  min-width: 0;
`

const storeNameStyle = css`
  font-size: 16px;
  font-weight: 600;
  color: #333D4B;
  margin-bottom: 4px;
`

const stockStyle = css`
  font-size: 14px;
  color: #6B7684;
  margin-bottom: 2px;
`

const addressStyle = css`
  font-size: 13px;
  color: #8B95A1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const mapButtonStyle = css`
  padding: 8px 12px;
  background: #F2F4F6;
  color: #333D4B;
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  
  &:active {
    background: #E5E8EB;
  }
`

const fixedBottomStyle = css`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  background: linear-gradient(to top, #ffffff 80%, transparent);
`

const buttonStyle = css`
  width: 100%;
  height: 56px;
  background: #3182F6;
  color: #ffffff;
  font-size: 17px;
  font-weight: 600;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  
  &:active {
    background: #1B64DA;
  }
`

type CafeWithDistance = Cafe & { distance: number }

function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  }
  return `${km.toFixed(1)}km`
}

// 파란색 지도 핀 아이콘 SVG
function MapPinIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
        fill="#3182F6"
      />
      <circle cx="12" cy="9" r="2.5" fill="#ffffff"/>
    </svg>
  )
}

// 네이버 지도 모바일 앱/웹으로 강제 이동 (PC 버전 절대 불가)
function openNaverMap(url: string) {
  // 모든 URL을 모바일 버전으로 강제 변환
  let mobileUrl = url
    .replace('place.naver.com', 'm.place.naver.com')
    .replace('map.naver.com', 'm.map.naver.com')
    // 이미 m.이 붙은 경우 중복 방지
    .replace('m.m.place', 'm.place')
    .replace('m.m.map', 'm.map')
  
  // naver.me 단축 URL인 경우 - 무조건 새 창에서 열기 (앱에서 처리하도록)
  if (url.includes('naver.me')) {
    // Intent URL 사용 (안드로이드에서 앱 없으면 웹으로 폴백)
    const isAndroid = /android/i.test(navigator.userAgent)
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    
    if (isAndroid) {
      // 안드로이드: Intent URL로 네이버 지도 앱 열기, 없으면 웹으로 폴백
      const intentUrl = `intent://place?url=${encodeURIComponent(url)}#Intent;scheme=nmap;package=com.nhn.android.nmap;S.browser_fallback_url=${encodeURIComponent(url)};end`
      window.location.href = intentUrl
      return
    }
    
    if (isIOS) {
      // iOS: 앱 스키마 시도 후 웹으로 폴백
      const appScheme = `nmap://place?url=${encodeURIComponent(url)}`
      window.location.href = appScheme
      setTimeout(() => {
        window.location.href = url
      }, 500)
      return
    }
    
    // 기타 환경 (PC 에뮬레이터 등): 그냥 열기
    window.location.href = url
    return
  }
  
  // 모바일 URL로 이동
  window.location.href = mobileUrl
}

interface ListScreenProps {
  stores: CafeWithDistance[]
  onShowMapWithAd: () => void
}

export function ListScreen({ stores, onShowMapWithAd }: ListScreenProps) {
  return (
    <div css={containerStyle}>
      <div css={topSectionStyle}>
        <h1 css={titleStyle}>주변 가게를 찾았어요</h1>
      </div>
      <div css={listStyle}>
        {stores.map((store, index) => (
          <div key={index} css={listItemStyle}>
            <div css={iconStyle}>
              <MapPinIcon />
            </div>
            <div css={contentsStyle}>
              <div css={storeNameStyle}>{store.n}</div>
              <div css={stockStyle}>
                남은 재고 {store.s}개 · {formatDistance(store.distance)}
              </div>
              <div css={addressStyle}>{store.a}</div>
            </div>
            <button css={mapButtonStyle} onClick={() => openNaverMap(store.u)}>
              지도
            </button>
          </div>
        ))}
      </div>
      <div css={fixedBottomStyle}>
        <button css={buttonStyle} onClick={onShowMapWithAd}>
          📺 광고보고 더 많은 두쫀쿠 찾기
        </button>
      </div>
    </div>
  )
}
