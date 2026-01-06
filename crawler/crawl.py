"""
두쫀쿠맵 크롤러
10분마다 GitHub Actions에서 자동 실행
"""

import requests
import json
from datetime import datetime, timezone, timedelta

URL = "https://www.dubaicookiemap.com"
OUTPUT = "public/stores.json"
KST = timezone(timedelta(hours=9))

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
    # 이스케이프된 형태로 찾기
    marker = '\\"cafes\\":['
    start = html.find(marker)
    
    if start == -1:
        # 이스케이프 없는 형태로도 시도
        marker = '"cafes":['
        start = html.find(marker)
    
    if start == -1:
        print("❌ cafes 없음")
        print(f"📄 HTML 샘플 (처음 200자): {html[:200]}")
        return None
    
    print(f"✅ cafes 발견! 위치: {start}, 패턴: {marker}")
    
    # cafes 배열 시작 위치
    arr_start = start + len(marker) - 1
    depth = 0
    arr_end = arr_start
    
    # 배열 끝 찾기 (이스케이프 고려)
    i = arr_start
    while i < len(html):
        c = html[i]
        # 이스케이프 처리: \" 는 무시
        if i > 0 and html[i-1] == '\\':
            i += 1
            continue
        
        if c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                arr_end = i + 1
                break
        i += 1
    
    # JSON 문자열 추출 및 이스케이프 제거
    json_str = html[arr_start:arr_end]
    # 이스케이프된 따옴표 제거
    json_str = json_str.replace('\\"', '"')
    
    try:
        cafes = json.loads(json_str)
        print(f"✅ {len(cafes)}개 카페 추출")
        return process_cafes(cafes)
    except Exception as e:
        print(f"❌ JSON 파싱 실패: {e}")
        print(f"📄 JSON 샘플 (처음 200자): {json_str[:200]}")
        return None

def process_cafes(cafes):
    """카페 데이터 가공 및 저장"""
    # 정리 (필요한 필드만, 용량 최소화)
    data = []
    for c in cafes:
        data.append({
            "n": c.get("name", ""),
            "a": c.get("address", ""),
            "y": c.get("lat", 0),
            "x": c.get("lng", 0),
            "s": c.get("stock_count", 0),
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
