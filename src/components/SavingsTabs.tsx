import { useState } from 'react';
import { Tab } from 'tosslib';
import { ProductList } from './ProductList';
import { SavingsFilterForm } from 'hooks/useSavingsFilterForm';

type SavingsTabsProps = {
  savingsFilterForm: SavingsFilterForm;
};

export const SavingsTabs = (props: SavingsTabsProps) => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <>
      <Tab onChange={setActiveTab}>
        <Tab.Item value="products" selected={activeTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={activeTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      <Contents activeTab={activeTab} {...props} />
    </>
  );
};

const Contents = ({ activeTab, savingsFilterForm }: SavingsTabsProps & { activeTab: string }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>();

  const handleClickProduct = (id: string) => {
    setSelectedProductId(id);
  };

  return (
    <>
      {activeTab === 'products' && (
        <ProductList
          selectedProductId={selectedProductId}
          onClick={handleClickProduct}
          filterOptions={savingsFilterForm}
        />
      )}
      {activeTab === 'results' && <ProductList filterOptions={savingsFilterForm} />}
    </>
  );
};
