import { SavingsProductType } from 'shared/types/api/savings';
import SavingsEmpty from './SavingsEmpty';
import { Fragment } from 'react';
import SavingsProduct from './SavingsProduct';

interface SavingsListProps {
  products: SavingsProductType[];
  renderEmpty?: React.ReactNode;
  renderItem: (product: SavingsProductType) => React.ReactNode;
}

export default function SavingsList({ products = [], renderEmpty = <SavingsEmpty />, renderItem }: SavingsListProps) {
  return (
    <>
      {products.length === 0
        ? renderEmpty
        : products.map(product => {
            return <Fragment key={product.id}>{renderItem(product)}</Fragment>;
          })}
    </>
  );
}

SavingsList.Item = SavingsProduct;
SavingsList.Empty = SavingsEmpty;
