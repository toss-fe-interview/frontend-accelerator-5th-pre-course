export default function ErrorFallback({ error }: { error: Error }) {
  return (
    <div>
      <p>문제가 발생했습니다.</p>
      <p>{error.message}</p>
    </div>
  );
}
