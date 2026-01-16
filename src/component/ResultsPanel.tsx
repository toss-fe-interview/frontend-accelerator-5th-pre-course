import { useSavingsProducts } from 'hooks/useSavingsProducts';
import { Border, ListHeader, ListRow, Spacing } from 'tosslib';
import { ProductSelection } from 'types/calculator';
import SavingsSummary from './SavingsSummary';
import RecommendedProductsList from './RecommendedProductsList';

const ResultsPanel = ({ selectedProductId, setSelectedProductId }: ProductSelection) => {
  // 데이터 페칭
  const { data: products, isLoading, isError } = useSavingsProducts();

  if (isLoading) {
    return <div>로딩중...</div>;
  }
  if (isError) {
    return <div>에러</div>;
  }

  if (!selectedProductId) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  return (
    <>
      <Spacing size={8} />
      <SavingsSummary products={products} selectedProductId={selectedProductId} />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      <RecommendedProductsList
        products={products}
        selectedProductId={selectedProductId}
        setSelectedProductId={setSelectedProductId}
      />

      <Spacing size={40} />
    </>
  );
};

export default ResultsPanel;
