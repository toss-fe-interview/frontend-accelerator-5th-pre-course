export const isSame = (target: { id: unknown }, source: { id: unknown } | null | undefined) => {
  return target.id === source?.id;
};
