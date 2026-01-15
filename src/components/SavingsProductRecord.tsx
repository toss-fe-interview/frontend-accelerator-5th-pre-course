import { Assets, colors, ListRow } from "tosslib";
import type { SavingsProduct } from "types";

const SavingsProductRecord = ({
	savingsProduct,
	selected,
	onSelect,
}: {
	savingsProduct: SavingsProduct;
	selected: boolean;
	onSelect: (savingsProduct: SavingsProduct) => void;
}) => {
	return (
		<ListRow
			contents={
				<ListRow.Texts
					type="3RowTypeA"
					top={savingsProduct.name}
					topProps={{
						fontSize: 16,
						fontWeight: "bold",
						color: colors.grey900,
					}}
					middle={`연 이자율: ${savingsProduct.annualRate}%`}
					middleProps={{
						fontSize: 14,
						color: colors.blue600,
						fontWeight: "medium",
					}}
					bottom={`${savingsProduct.minMonthlyAmount.toLocaleString()}원 ~ ${savingsProduct.maxMonthlyAmount.toLocaleString()}원 | ${savingsProduct.availableTerms}개월`}
					bottomProps={{ fontSize: 13, color: colors.grey600 }}
				/>
			}
			right={
				selected ? <Assets.Icon name="icon-check-circle-green" /> : undefined
			}
			onClick={() => onSelect(savingsProduct)}
		/>
	);
};

export { SavingsProductRecord };
