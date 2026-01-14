import type { ReactNode } from 'react';
import { ListRow } from 'tosslib';

interface ApiStateHandlerProps {
  isLoading: boolean;
  error: string | null;
  children: ReactNode;
  loadingMessage?: string;
}

/**
 * API 호출 시 로딩 및 에러 상태를 처리하는 공통 컴포넌트
 * @param isLoading - 로딩 상태
 * @param error - 에러 메시지
 * @param children - 데이터가 정상적으로 로드되었을 때 렌더링할 컴포넌트
 * @param loadingMessage - 로딩 메시지 (기본값: "데이터를 불러오는 중...")
 */
export function ApiStateHandler({
  isLoading,
  error,
  children,
  loadingMessage = '데이터를 불러오는 중...',
}: ApiStateHandlerProps) {
  if (isLoading) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top={loadingMessage} />}></ListRow>;
  }

  if (error) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top={error} />}></ListRow>;
  }

  return <>{children}</>;
}
