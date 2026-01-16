import filterProducts from 'utils/filterProducts';
import { useSavingsProducts } from 'hooks/useSavingsProducts';
import { useFormContext } from 'react-hook-form';
import { Assets, colors, ListRow } from 'tosslib';
import { ProductSelection } from 'types/calculator';

const ProductsTab = ({ selectedProductId, setSelectedProductId }: ProductSelection) => {
  // 데이터 페칭
  const { data: products, isLoading, isError } = useSavingsProducts();
  const { watch } = useFormContext();

  // 폼 값
  const monthlyAmount = Number(watch('monthlyAmount')) || 0;
  const savingPeriod = Number(watch('savingPeriod')) || 0;

  // 상품 필터링
  const filteredProducts = filterProducts(products, monthlyAmount, savingPeriod);

  if (isLoading) {
    return <div>로딩중...</div>;
  }
  if (isError) {
    return <div>에러</div>;
  }

  const noProducts = !filteredProducts || filteredProducts.length === 0;
  if (noProducts) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없습니다." />} />;
  }

  return (
    <>
      {filteredProducts.map(item => (
        <ListRow
          key={item.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={item.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${item.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${item.minMonthlyAmount.toLocaleString()}원 ~ ${item.maxMonthlyAmount.toLocaleString()}원 | ${item.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={selectedProductId === item.id && <Assets.Icon name="icon-check-circle-green" />}
          onClick={() => setSelectedProductId(item.id)}
        />
      ))}
    </>
  );
};

export default ProductsTab;
