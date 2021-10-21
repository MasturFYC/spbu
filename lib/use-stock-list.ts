import moment from "moment";
import { iJournal } from "../components/interfaces";
import { useAsyncList } from '@react-stately/data';
import { initJournal } from "./use-journal";

export const useStockList = (startDate?: string | string[] | undefined, endDate?: string | string[] | undefined) => {
  const s = startDate || moment().format('YYYY-MM-DD')
  const e = endDate || moment().format('YYYY-MM-DD')
  return useAsyncList<iJournal>({
    async load({ signal }) {
      const res = await fetch(
        `/api/stock?s=${s}&e=${e}`,
        {
          signal,
        }
      );
      const json: iJournal[] | any = await res.json();

      const newJournal = {
        ...initJournal,
        code: 'STO',
        proof: 'STO-000000000',
        dateOutput: moment().format('DD-MMM-YYYY')
      };

      return {
        items:
          res.status === 200
            ? [newJournal, ...json]
            : [newJournal],
      };
    },
    getKey: (item: iJournal) => item.id,
  });
}