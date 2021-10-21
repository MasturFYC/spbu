import useSWR from "swr";
import { iEmployee, mutateOption } from "../components/interfaces";
import { fetcher } from "./use-product";

export type employeeHookData = {
  isLoading: boolean;
  employees?: iEmployee[];
  error: any;
  mutateEmployee: (data?: iEmployee[], shouldRevalidate?: boolean) => void;
}

export const useEmployee = (): employeeHookData => {
  const url = '/api/employee'
  const { data, error, mutate } = useSWR<iEmployee[]>(url, fetcher, mutateOption);
  return {
    isLoading: !error && !data,
    employees: data,
    error: error,
    mutateEmployee: mutate
  } as employeeHookData;
} 