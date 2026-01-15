import { ReactNode } from 'react';
import { SavingsTabValue } from 'pages/SavingsCalculatorPage';

interface SavingTabContentProps {
  selectedTab: SavingsTabValue;
  renderProps: (tab: SavingsTabValue) => ReactNode;
}

export function SavingTabContent({ selectedTab, renderProps }: SavingTabContentProps) {
  return <>{renderProps(selectedTab)}</>;
}
