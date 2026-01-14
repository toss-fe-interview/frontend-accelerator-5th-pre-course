import { useReducer } from 'react';

interface UseSavingsInputsState {
  targetAmount: string;
  monthlyPayment: string;
  term: number;
}

type UseSavingsInputsAction =
  | {
      type: 'targetAmount';
      payload: string;
    }
  | {
      type: 'monthlyPayment';
      payload: string;
    }
  | {
      type: 'term';
      payload: number;
    };

function reducer(state: UseSavingsInputsState, action: UseSavingsInputsAction): UseSavingsInputsState {
  switch (action.type) {
    case 'targetAmount':
      return { ...state, targetAmount: action.payload };
    case 'monthlyPayment':
      return { ...state, monthlyPayment: action.payload };
    case 'term':
      return { ...state, term: action.payload };
  }
}

const useSavingsInputs = () => {
  const [state, dispatch] = useReducer(reducer, {
    targetAmount: '',
    monthlyPayment: '',
    term: 12,
  });

  return { state, dispatch };
};

export default useSavingsInputs;
