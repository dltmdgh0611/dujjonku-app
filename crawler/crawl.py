"""
두쫀쿠를 찾아라 크롤러
10분마다 GitHub Actions에서 자동 실행
"""

import requests
import json
import re
from datetime import datetime, timezone, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed

URL = "https://www.dubaicookiemap.com"
OUTPUT = "public/stores.json"
KST = timezone(timedelta(hours=9))

# 모바일 User-Agent (naver.me 리졸브용)
MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'

def convert_to_mobile_url(url, retries=2):
    """URL을 모바일 버전으로 변환 (재시도 포함)"""
    if not url:
        return url
    
    # 이미 모바일 URL이면 그대로 반환
    if 'm.place.naver.com' in url or 'm.map.naver.com' in url:
        return url
    
    # PC URL을 모바일로 변환
    if 'place.naver.com' in url:
        return url.replace('place.naver.com', 'm.place.naver.com')
    if 'map.naver.com' in url:
        return url.replace('map.naver.com', 'm.map.naver.com')
    
    # naver.me 단축 URL은 리졸브해서 모바일 URL로 변환
    if 'naver.me' in url:
        for attempt in range(retries):
            try:
                # HEAD 요청으로 리다이렉트 위치 확인 (모바일 UA 사용)
                res = requests.head(url, allow_redirects=True, timeout=8, headers={
                    'User-Agent': MOBILE_UA
                })
                final_url = res.url
                # 최종 URL을 모바일로 변환
                if 'place.naver.com' in final_url and 'm.place.naver.com' not in final_url:
                    final_url = final_url.replace('place.naver.com', 'm.place.naver.com')
                if 'map.naver.com' in final_url and 'm.map.naver.com' not in final_url:
                    final_url = final_url.replace('map.naver.com', 'm.map.naver.com')
                return final_url
            except Exception:
                if attempt < retries - 1:
                    continue  # 재시도
                # 최종 실패하면 원본 URL 반환
                return url
    
    return url

def convert_urls_batch(cafes):
    """모든 카페 URL을 병렬로 모바일 버전으로 변환"""
    print("🔄 URL을 모바일 버전으로 변환 중...")
    
    results = {}
    with ThreadPoolExecutor(max_workers=20) as executor:
        future_to_idx = {
            executor.submit(convert_to_mobile_url, cafe.get('naver_place_url', '')): idx 
            for idx, cafe in enumerate(cafes)
        }
        
        done_count = 0
        for future in as_completed(future_to_idx):
            idx = future_to_idx[future]
            try:
                results[idx] = future.result()
            except Exception:
                results[idx] = cafes[idx].get('naver_place_url', '')
            
            done_count += 1
            if done_count % 100 == 0:
                print(f"  ... {done_count}/{len(cafes)} 완료")
    
    # 결과 적용
    for idx, url in results.items():
        cafes[idx]['naver_place_url'] = url
    
    print(f"✅ URL 변환 완료")
    return cafes

def crawl():
    print("🍪 크롤링 시작...")
    
    try:
        res = requests.get(URL, timeout=30, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        html = res.text
        print(f"✅ HTML 로드 ({len(html):,} bytes)")
    except Exception as e:
        print(f"❌ 실패: {e}")
        return None
    
    # Next.js self.__next_f.push 안에 cafes 데이터 찾기
    print("🔍 self.__next_f.push 안에서 cafes 찾기...")
    
    # 방법 1: 정규식으로 cafes 배열 추출 (더 안정적)
    # 이스케이프된 형태: \"cafes\":[...]
    pattern = r'\\"cafes\\":\s*(\[.*?\])\s*(?:,\s*\\"|\})'
    match = re.search(pattern, html, re.DOTALL)
    
    if not match:
        # 이스케이프 없는 형태로도 시도
        pattern = r'"cafes":\s*(\[.*?\])\s*(?:,\s*"|\})'
        match = re.search(pattern, html, re.DOTALL)
    
    if not match:
        # 방법 2: 기존 방식으로 fallback (개선된 파싱)
        json_str = extract_cafes_fallback(html)
        if not json_str:
            print("❌ cafes 없음")
            return None
    else:
        json_str = match.group(1)
        print(f"✅ cafes 발견! (정규식 매칭)")
    
    # 이스케이프 제거
    json_str = json_str.replace('\\"', '"')
    json_str = json_str.replace('\\\\', '\\')
    
    try:
        cafes = json.loads(json_str)
        print(f"✅ {len(cafes)}개 카페 추출")
        
        # URL을 모바일 버전으로 변환
        cafes = convert_urls_batch(cafes)
        
        return process_cafes(cafes)
    except Exception as e:
        print(f"❌ JSON 파싱 실패: {e}")
        print(f"📄 JSON 샘플 (처음 200자): {json_str[:200]}")
        return None

def extract_cafes_fallback(html):
    """기존 방식의 개선된 버전 - 문자열 내부 고려"""
    # 이스케이프된 형태로 찾기
    marker = '\\"cafes\\":['
    start = html.find(marker)
    is_escaped = True
    
    if start == -1:
        marker = '"cafes":['
        start = html.find(marker)
        is_escaped = False
    
    if start == -1:
        return None
    
    print(f"✅ cafes 발견! 위치: {start}, 이스케이프: {is_escaped}")
    
    # cafes 배열 시작 위치
    arr_start = start + len(marker) - 1
    
    # 문자열 내부인지 추적하면서 배열 끝 찾기
    depth = 0
    in_string = False
    i = arr_start
    
    while i < len(html):
        c = html[i]
        
        # 이스케이프된 문자 건너뛰기
        if is_escaped:
            if html[i:i+2] == '\\"':
                i += 2
                continue
            if html[i:i+2] == '\\\\':
                i += 2
                continue
        else:
            if i > 0 and html[i-1] == '\\' and c == '"':
                i += 1
                continue
        
        # 문자열 시작/끝 추적
        if c == '"':
            in_string = not in_string
        
        # 문자열 밖에서만 깊이 추적
        if not in_string:
            if c == '[':
                depth += 1
            elif c == ']':
                depth -= 1
                if depth == 0:
                    return html[arr_start:i+1]
        
        i += 1
    
    return None

def get_stock_value(cafe):
    """stock_status 또는 stock_count에서 재고 값 추출"""
    # stock_count가 있으면 사용 (숫자)
    if 'stock_count' in cafe:
        return cafe.get('stock_count', 0)
    
    # stock_status가 있으면 변환 (문자열)
    status = cafe.get('stock_status', '')
    if status == 'SOLDOUT' or status == 'sold_out' or status == '':
        return 0
    elif status == 'IN_STOCK' or status == 'in_stock' or status == 'AVAILABLE':
        return 1
    else:
        # 알 수 없는 상태는 재고 있음으로 처리
        return 1 if status else 0

def process_cafes(cafes):
    """카페 데이터 가공 및 저장"""
    # 정리 (필요한 필드만, 용량 최소화)
    data = []
    for c in cafes:
        stock = get_stock_value(c)
        data.append({
            "n": c.get("name", ""),
            "a": c.get("address", ""),
            "y": c.get("lat", 0),
            "x": c.get("lng", 0),
            "s": stock,
            "u": c.get("naver_place_url", "")
        })
    
    # 재고 있는 곳 먼저
    data.sort(key=lambda x: (x['s'] == 0, -x['s']))
    
    available = sum(1 for d in data if d['s'] > 0)
    
    output = {
        "t": datetime.now(KST).strftime("%m/%d %H:%M"),
        "c": len(data),
        "a": available,
        "d": data
    }
    
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, separators=(',', ':'))
    
    print(f"💾 저장 완료: {len(data)}개 (재고있음: {available})")
    return output

if __name__ == "__main__":
    crawl()
