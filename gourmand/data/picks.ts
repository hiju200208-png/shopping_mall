export interface Pick {
  title: string;        // 화면에 보일 제목
  productIds: number[]; // data/products.ts의 id
}

// 키가 곧 주소(/pick/heeju)가 됩니다
export const picks: Record<string, Pick> = {
  heeju:   { title: "희주's pick",   productIds: [3,4,5,6,11,15,29,38,39,43] },
  yeju:    { title: "예주's pick",   productIds: [3,4,5,6,11,15,29,38,39,43] },
  jongbok: { title: "종복's pick",   productIds: [3,4,5,6,11,15,29,38,39,43] },
  gang:    { title: "강's pick",     productIds: [3,4,5,6,11,15,29,38,39,43] },
};