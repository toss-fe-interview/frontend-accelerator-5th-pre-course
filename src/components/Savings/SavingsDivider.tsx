import { Spacing, Border } from 'tosslib';

interface SavingsDividerProps {
  spacing?: number;
  height?: number;
}

export function SavingsDivider({ spacing = 24, height = 16 }: SavingsDividerProps) {
  return (
    <>
      <Spacing size={spacing} />
      <Border height={height} />
      <Spacing size={8} />
    </>
  );
}
