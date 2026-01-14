import { NavigationBar, Spacing, ListRow } from 'tosslib';

const LoadingView = () => {
  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      <ListRow contents={<ListRow.Texts type="1RowTypeA" top="적금 상품을 불러오는 중입니다." />} />;
    </>
  );
};

const ErrorView = () => {
  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      <ListRow contents={<ListRow.Texts type="1RowTypeA" top="적금 상품을 불러 오는데 실패했습니다." />} />;
    </>
  );
};

/**
 * 공통 뷰
 */
export const View = {
  // Loading View
  Loading: LoadingView,
  // Error View
  Error: ErrorView,
} as const;
