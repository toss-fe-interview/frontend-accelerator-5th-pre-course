import type { SavingsProduct } from "types";
import { isInRange, percentageToFloat } from "utils/number";

export function isTabEnum(value: unknown): value is "products" | "results" {
	return ["products", "results"].some((tab) => tab === value);
}

export const get반기예상연이자율 = (annualRate: number) =>
	1 + percentageToFloat(annualRate) * 0.5;

export const isMonthlyAmountInRange = (
	savingProduct: SavingsProduct,
	monthlyAmount: number,
) =>
	isInRange(
		monthlyAmount,
		savingProduct.minMonthlyAmount,
		savingProduct.maxMonthlyAmount,
	);
