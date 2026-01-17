import * as v from 'valibot';

export const SavingsProductSchema = v.pipe(
  v.object({
    id: v.string(),
    name: v.string(),
    annualRate: v.pipe(
      v.number(),
      v.minValue(0, '이자율은 0% 이상이어야 합니다'),
      v.maxValue(100, '이자율은 100% 이하여야 합니다')
    ),
    minMonthlyAmount: v.pipe(
      v.number(),
      v.minValue(0, '최소 월 납입액은 0원 이상이어야 합니다'),
      v.integer('월 납입액은 정수여야 합니다')
    ),
    maxMonthlyAmount: v.pipe(
      v.number(),
      v.minValue(0, '최대 월 납입액은 0원 이상이어야 합니다'),
      v.integer('월 납입액은 정수여야 합니다')
    ),
    availableTerms: v.pipe(v.number(), v.integer('저축 기간은 정수여야 합니다')),
  }),
  v.check(
    product => product.minMonthlyAmount <= product.maxMonthlyAmount,
    '최소 월 납입액은 최대 월 납입액보다 작거나 같아야 합니다'
  )
);

export type SavingsProduct = v.InferOutput<typeof SavingsProductSchema>;
