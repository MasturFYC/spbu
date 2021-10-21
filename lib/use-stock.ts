import useSWR from "swr";
import { initJournal } from "./use-journal";
import { iJournal, mutateOption } from "@components/interfaces";
import { fetcher } from "./use-product";

export type stockHookData = {
  isLoading: boolean;
  stock: iJournal;
  error: any;
  mutate: (data?: iJournal, shouldRevalidate?: boolean) => void;
}

export default function useStock (id: string | string[] | undefined) {
  const journalId = id ? +id : 0;
  const url = `/api/stock/${journalId}`
  const { data, error, mutate } = useSWR<iJournal>(url, fetcher, mutateOption);

  return {
    isLoading: !error && !data,
    stock: data ? data : {initJournal, code:'STO'},
    error: error,
    mutate: mutate
  } as stockHookData;
}