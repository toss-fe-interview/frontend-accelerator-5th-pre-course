import React from 'react';
import { SavingsProduct } from 'api/savings-products';
import { colors, ListRow } from 'tosslib';
import { addComma } from 'utils/add-comma';

interface SavingsRecommendationProps {
  savingsProducts: SavingsProduct[];
}
export const SavingsRecommendation = ({ savingsProducts }: SavingsRecommendationProps) => {
  return (
    <>
      {savingsProducts
        .sort((productA, productB) => productB.annualRate - productA.annualRate)
        .slice(0, 2)
        .map(product => (
          <ListRow
            key={product.id}
            contents={
              <ListRow.Texts
                type="3RowTypeA"
                top={'고급 정기적금'}
                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                middle={`연 이자율: ${product.annualRate}%`}
                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                bottom={`${addComma(product.minMonthlyAmount)}원 ~ ${addComma(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
          />
        ))}
    </>
  );
};
