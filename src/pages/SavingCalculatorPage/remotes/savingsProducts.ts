import { queryOptions } from "@tanstack/react-query";
import { http } from "tosslib";
import { SavingsProduct } from "../types/savingsProduct";

export function savingsProductsQueryOptions() {
    return queryOptions({
        queryKey: ['savingProducts'],
        queryFn: getSavingsProducts,
    })
}


export function getSavingsProducts() {
    return http.get<SavingsProduct[]>('/api/savings-products');
}