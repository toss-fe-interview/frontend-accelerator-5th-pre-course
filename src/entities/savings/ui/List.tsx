import { ReactNode } from 'react';

type ListProps<T> = {
  list: T[];
  children: (product: T) => ReactNode;
};

const List = <T extends object>({ list: products, children }: ListProps<T>) => {
  const isEmptyProduct = products.length === 0;

  if (isEmptyProduct) {
    return null;
  }

  return (
    <>
      {products.map(product => (
        <>{children(product)}</>
      ))}
    </>
  );
};

export default List;
