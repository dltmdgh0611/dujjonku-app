// 카페 데이터 타입 (압축된 필드명)
export interface Cafe {
  n: string;  // name
  a: string;  // address
  y: number;  // lat
  x: number;  // lng
  s: number;  // stock
  u: string;  // naver url
}

// stores.json 구조
export interface StoreData {
  t: string;    // updated time
  c: number;    // total count
  a: number;    // available count
  d: Cafe[];    // data (cafes)
}

// 네이버 맵 전역 타입
declare global {
  interface Window {
    naver: typeof naver;
  }
}
