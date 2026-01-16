import { ChangeEvent } from 'react';
import { TextField } from 'tosslib';

type NumberFieldProps = Omit<React.ComponentProps<typeof TextField>, 'onChange' | 'value'> & {
  value: string;
  onChange: (value: string) => void;
  formatter?: (value: string) => string;
};

export const NumberField = (props: NumberFieldProps) => {
  const { value, onChange, formatter = defaultFormatter, ...rest } = props;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/,/g, '');

    if (isNaN(Number(newValue))) {
      return;
    }

    onChange(newValue);
  };

  return <TextField value={value === '' ? '' : formatter(value)} onChange={handleChange} {...rest} />;
};

const defaultFormatter = (v: string) => v;
