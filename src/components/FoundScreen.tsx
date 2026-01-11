import { css } from '@emotion/react'

const containerStyle = css`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  padding-bottom: 100px; /* 하단 버튼 영역 보정 */
`

const contentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const checkIconStyle = css`
  width: 80px;
  height: 80px;
  margin-bottom: 32px;
`

const titleStyle = css`
  font-size: 24px;
  font-weight: 700;
  color: #191F28;
  text-align: center;
  margin-bottom: 8px;
`

const subtitleStyle = css`
  font-size: 16px;
  color: #4E5968;
  text-align: center;
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

// 파란색 원형 체크 아이콘
function CheckCircleIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="40" fill="#3182F6"/>
      <path 
        d="M24 40L35 51L56 30" 
        stroke="white" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface FoundScreenProps {
  storeCount: number
  onConfirm: () => void
}

export function FoundScreen({ storeCount, onConfirm }: FoundScreenProps) {
  return (
    <div css={containerStyle}>
      <div css={contentStyle}>
        <div css={checkIconStyle}>
          <CheckCircleIcon />
        </div>
        <h1 css={titleStyle}>찾기 완료!</h1>
        <p css={subtitleStyle}>
          가까운곳에 {storeCount}개의 두쫀쿠 가게가 있어요.
        </p>
      </div>
      <div css={fixedBottomStyle}>
        <button css={buttonStyle} onClick={onConfirm}>
          확인하기
        </button>
      </div>
    </div>
  )
}
