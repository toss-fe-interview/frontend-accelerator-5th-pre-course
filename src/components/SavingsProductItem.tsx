import React from 'react';
import { Assets, colors, ListRow } from 'tosslib';
import type { SavingsProduct } from 'api/savings-products';
import { addComma } from 'utils/add-comma';

interface SavingsProductItemProps {
  product: SavingsProduct;
  onClick?: () => void;
  isSelected: boolean;
}

export const SavingsProductItem = ({ product, onClick, isSelected = false }: SavingsProductItemProps) => {
  return (
    <ListRow
      key={product.id}
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${addComma(product.minMonthlyAmount)}원 ~ ${addComma(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected && <Assets.Icon name="icon-check-circle-green" />}
      onClick={onClick}
    />
  );
};
