export const toggleQueryParam = ({ name, value }: { name: string; value: string }) => {
  return (prev: URLSearchParams) => {
    const next = new URLSearchParams(prev);
    if (next.get(name) === value) {
      next.delete(name);
    } else {
      next.set(name, value);
    }
    return next;
  };
};
