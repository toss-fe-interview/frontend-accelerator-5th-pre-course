import { commaizeNumber } from '@shared/utils';
import { ChangeEvent } from 'react';
import { TextField } from 'tosslib';

type NumberFieldProps = Omit<React.ComponentProps<typeof TextField>, 'onChange' | 'value'> & {
  value?: number;
  onChange: (value: number) => void;
  renderValues?: (value: number) => string;
};

export const NumberField = (props: NumberFieldProps) => {
  const { value, onChange, renderValues = defaultRenderValues, ...rest } = props;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/,/g, '');

    if (newValue === '') {
      onChange(0);
      return;
    }

    if (isNaN(Number(newValue))) {
      return;
    }

    onChange(Number(newValue));
  };

  return <TextField value={!value ? '' : renderValues(value)} onChange={handleChange} {...rest} />;
};

const defaultRenderValues = (v: number) => commaizeNumber(v);
