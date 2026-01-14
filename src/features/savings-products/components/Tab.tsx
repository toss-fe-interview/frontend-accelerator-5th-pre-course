import { Tab } from 'tosslib';
import { SAVINGS_PRODUCT_TABS } from '../constants';

type SavingsProductTabProps = {
  tab: string;
  handleTabChange: (value: string) => void;
};

export const SavingsProductTab = ({ tab, handleTabChange }: SavingsProductTabProps) => {
  return (
    <Tab onChange={handleTabChange}>
      <Tab.Item value={SAVINGS_PRODUCT_TABS.PRODUCTS} selected={tab === SAVINGS_PRODUCT_TABS.PRODUCTS}>
        적금 상품
      </Tab.Item>
      <Tab.Item value={SAVINGS_PRODUCT_TABS.RESULTS} selected={tab === SAVINGS_PRODUCT_TABS.RESULTS}>
        계산 결과
      </Tab.Item>
    </Tab>
  );
};
