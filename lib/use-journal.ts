import moment from "moment";
import { iJournal } from "../components/interfaces";
import { useAsyncList } from '@react-stately/data';

export const initJournal: iJournal = {
  id: 0,
  userId: 0,
  code: '',
  refId: 0,
  proof: '',
  tags: '',
  totalCred: 0,
  totalDebt: 0,
  dateTransact: moment().format('YYYY-MM-DD HH:mm'),
  createdAt: moment().format('YYYY-MM-DD HH:mm'),
  updatedAt: moment().format('YYYY-MM-DD HH:mm'),
  details: [],
}

export const comparer = (a: iJournal, b: iJournal) => {
  if (a.id < b.id) {
    return 1;
  }
  if (b.id < a.id) {
    return -1;
  }
  return 0;
};


export const useJournal = (startDate?: string | string[], endDate?: string | string[]) => {
  return useAsyncList<iJournal>({
    async load({ signal }) {
      const res = await fetch(
        `/api/journal?s=${startDate || moment('2001-01-01').format('YYYY-MM-DD')
        }&e=${endDate || moment().format('YYYY-MM-DD')}`,
        {
          signal,
        }
      );
      const json: iJournal[] | any = await res.json();

      const newJournal = {
        ...initJournal,
        code: 'JRU',
      };

      return {
        items:
          res.status === 200
            ? [...json.sort(comparer), newJournal]
            : [newJournal],
      };
    },
    getKey: (item: iJournal) => item.id,
  });
}