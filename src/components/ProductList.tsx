import { ProductItem } from 'types/products';
import Product from './ProductItem';

interface ProductListProps {
  products: ProductItem[];
  onClickProduct: (id: string) => void;
}

export default function ProductList({ products, onClickProduct }: ProductListProps) {
  return (
    <>
      {products.map(product => (
        <button
          key={product.id}
          onClick={() => {
            onClickProduct(product.id);
          }}
        >
          <Product product={product} isActive={product.isSelected} />
        </button>
      ))}
    </>
  );
}
