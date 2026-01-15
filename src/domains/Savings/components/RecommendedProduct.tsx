import { Spacing, Border, ListHeader } from 'tosslib';
import { ReactNode } from 'react';

interface RecommendedProductProps {
  title:string
  children:ReactNode

}

export function RecommendedProduct({
  title,children
}: RecommendedProductProps) {
  return (
    <>
      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">{title}</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      {children}

    </>
  );
}
