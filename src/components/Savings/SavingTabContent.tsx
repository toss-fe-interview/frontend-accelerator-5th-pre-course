import { ReactNode } from 'react';
import { SavingsTabValue } from 'pages/SavingsCalculatorPage';
import { useSavingsContext } from './index';

interface SavingTabContentProps {
  renderProps: (tab: SavingsTabValue) => ReactNode;
}

export function SavingTabContent({ renderProps }: SavingTabContentProps) {
  const { selectedTab } = useSavingsContext();

  return <>{renderProps(selectedTab)}</>;
}
