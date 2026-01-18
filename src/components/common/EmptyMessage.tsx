import { colors, Spacing } from 'tosslib';

interface EmptyMessageProps {
  message: string;
}

export function EmptyMessage({ message }: EmptyMessageProps) {
  return (
    <>
      <Spacing size={40} />
      <div style={{ textAlign: 'center', color: colors.grey500, fontSize: 14 }}>{message}</div>
      <Spacing size={40} />
    </>
  );
}
