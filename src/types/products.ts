import { ProductResponseDto } from 'utils/api';

export type ProductItem = ProductResponseDto & { isSelected: boolean };
