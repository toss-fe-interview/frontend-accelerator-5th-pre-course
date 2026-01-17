import { queryOptions } from "@tanstack/react-query";
import { http } from "tosslib";
import { SavingsProduct } from "./get-savings";

export function getSavingsProductsQueryOptions() {
  return queryOptions({
    queryKey: ['savings-products'],
    queryFn: () => http.get<SavingsProduct[]>('/api/savings-products'),
  });
}