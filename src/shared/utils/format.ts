/**
 * 금액 포맷팅 (천 단위 콤마 및 '원' 접미사)
 */
export function formatCurrency(amount: number) {
  return `${Math.floor(amount).toLocaleString()}원`;
}
