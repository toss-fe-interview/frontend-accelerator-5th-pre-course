import React from 'react';
import { colors } from 'tosslib';
import { ListRow } from 'tosslib';

const CalculationResultListRowTexts = ({ label, value }: { label: string; value: string }) => {
  return (
    <ListRow.Texts
      type="2RowTypeA"
      top={label}
      topProps={{ color: colors.grey600 }}
      bottom={`${value}원`}
      bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
    />
  );
};

export default CalculationResultListRowTexts;
