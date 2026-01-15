import { NavigationBar, Spacing } from 'tosslib';

interface SavingsNavigationBarProps {
  title?: string;
}

export function SavingsNavigationBar({ title }: SavingsNavigationBarProps) {
  return <>
    <NavigationBar title={title} />
    <Spacing size={16} />
  </>
}
