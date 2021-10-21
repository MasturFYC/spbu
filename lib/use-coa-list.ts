import useSWR from "swr";
import { iCoa, mutateOption } from "../components/interfaces";
import { initCoa } from "./use-coa";
import { fetcher } from "./use-product";

export type hookCOAListData = {
  isLoading: boolean;
  coaList?: iCoa[];
  error: any;
  mutateCOA: (data?: iCoa[], shouldRevalidate?: boolean) => void;
}

export const useCOAList = (): hookCOAListData => {
  const { data, error, mutate } = useSWR<iCoa[]>('/api/coa/load', fetcher, mutateOption);
  return {
    isLoading: !error && !data,
    coaList: data && [...data, initCoa] || [initCoa],
    error: error,
    mutateCOA: mutate
  } as hookCOAListData;
}