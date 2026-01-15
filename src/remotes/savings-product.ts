import { queryOptions } from "@tanstack/react-query";
import ky from "ky";
import type { SavingsProduct } from "types";

export const getSavingsProducts = async () =>
	ky.get<SavingsProduct[]>("api/savings-products").json();

export const getSavingsProductsQueryOptions = () =>
	queryOptions({ queryKey: ["savings-products"], queryFn: getSavingsProducts });
