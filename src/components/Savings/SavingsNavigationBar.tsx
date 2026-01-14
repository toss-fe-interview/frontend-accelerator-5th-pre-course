import { NavigationBar, Spacing } from 'tosslib';

interface SavingsNavigationBarProps {
  title?: string;
}

export function SavingsNavigationBar({ title = '적금 계산기' }: SavingsNavigationBarProps) {
  return <>
  <NavigationBar title={title} />;
     <Spacing size={16} />
    </>
}
