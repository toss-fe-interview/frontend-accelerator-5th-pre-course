import { FC } from 'react';
import type { ErrorBoundaryFallbackProps } from '@suspensive/react';
import { Button, ListRow } from 'tosslib';

export const SavingProductErrorFallback: FC<ErrorBoundaryFallbackProps> = ({ reset }) => {
  return (
    <div>
      <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품 정보를 불러오는데 실패했습니다." />} />
      <Button onClick={reset} css={{ marginLeft: 24 }}>
        다시 시도
      </Button>
    </div>
  );
};
