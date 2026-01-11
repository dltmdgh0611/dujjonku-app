import { css, keyframes } from '@emotion/react'

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

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
`

const contentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const spinnerContainerStyle = css`
  width: 80px;
  height: 80px;
  margin-bottom: 32px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const spinnerStyle = css`
  width: 80px;
  height: 80px;
  border: 4px solid #F2F4F6;
  border-top: 4px solid #3182F6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const titleStyle = css`
  font-size: 22px;
  font-weight: 700;
  color: #191F28;
  line-height: 1.4;
  margin-bottom: 8px;
`

const subtitleStyle = css`
  font-size: 15px;
  color: #8B95A1;
  line-height: 1.5;
`

export function LoadingScreen() {
  return (
    <div css={containerStyle}>
      <div css={contentStyle}>
        <div css={spinnerContainerStyle}>
          <div css={spinnerStyle} />
        </div>
        <h1 css={titleStyle}>주변 두쫀쿠 매장 재고를<br/>불러오고 있어요</h1>
        <p css={subtitleStyle}>잠시만 기다려주세요.</p>
      </div>
    </div>
  )
}
