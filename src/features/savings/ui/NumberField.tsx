import { TextField } from 'tosslib';

const NUM_MAX_LENGTH = 13;

const NumberField = ({ label, value, onChange }: { label: string; value: string; onChange: (e: number) => void }) => {
  return (
    <TextField
      label={label}
      placeholder={`${label}을 입력하세요`}
      suffix="원"
      value={value}
      onChange={e => {
        // 세부사항
        const value = e.target.value;
        if (value.length > NUM_MAX_LENGTH) return;
        const onlyNumber = Number(value.replace(/[^0-9]/g, ''));
        onChange(onlyNumber);
      }}
    />
  );
};

export default NumberField;
