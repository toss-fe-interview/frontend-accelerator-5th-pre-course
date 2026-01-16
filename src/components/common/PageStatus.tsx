import { colors, NavigationBar, Spacing } from 'tosslib';

interface PageStatusProps {
  title: string;
  message: string;
}

export function PageStatus({ title, message }: PageStatusProps) {
  return (
    <>
      <NavigationBar title={title} />
      <Spacing size={100} />
      <div style={{ textAlign: 'center', color: colors.grey500, fontSize: 14 }}>{message}</div>
    </>
  );
}
