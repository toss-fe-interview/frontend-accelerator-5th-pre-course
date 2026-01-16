import { useEffect, useState } from 'react';
import { getSavingsProducts } from '../api/getSavingsProducts';
import { SavingsInput, SavingsProduct } from '../types/types';

export function useSavingsProducts({ savingsInput }: { savingsInput: SavingsInput }) {
  const [savingsProducts, setSavingsProducts] = useState<SavingsProduct[]>([]);

  useEffect(() => {
    const fetchSavingsProducts = async () => {
      const response = await getSavingsProducts();
      if (response) {
        setSavingsProducts(response);
      }
    };

    fetchSavingsProducts();
  }, []);

  //   - 월 납입액
  //   - `product.minMonthlyAmount` (최소 월 납입액)보다 크고
  //   - `product.maxMonthlyAmount` (최대 월 납입액)보다 작아야 함
  // - 저축 기간
  //   - `product.availableTerms` (저축 기간)와 동일해야 함
  const filteredSavingsProducts = savingsProducts.filter(product => {
    const isMonthlyAmountValid =
      Number(savingsInput.monthlyAmount) >= product.minMonthlyAmount &&
      Number(savingsInput.monthlyAmount) <= product.maxMonthlyAmount;
    const isTermMatched = product.availableTerms === savingsInput.savingsTerm;
    return isMonthlyAmountValid && isTermMatched;
  });

  // 사용자가 입력한 조건에 맞는 적금 상품 중 연 이자율이 가장 높은 2개의 상품을 출력해주세요.
  const recommendedSavingsProducts = [...filteredSavingsProducts]
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);

  return { filteredSavingsProducts, recommendedSavingsProducts };
}
