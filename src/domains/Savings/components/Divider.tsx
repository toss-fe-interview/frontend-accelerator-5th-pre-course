import { Spacing, Border } from 'tosslib';

interface DividerProps {
  spacing?: number;
  height?: number;
}

export function Divider({ spacing = 24, height = 16 }: DividerProps) {
  return (
    <>
      <Spacing size={spacing} />
      <Border height={height} />
      <Spacing size={8} />
    </>
  );
}
