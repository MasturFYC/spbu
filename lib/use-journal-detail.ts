import moment from "moment";
// import useSWR from "swr";
import { useAsyncList, AsyncListData } from '@react-stately/data'
import { iJournalDetail, iOrder } from "../components/interfaces";
//import { fetcher } from "./use-product";

// export type hookJournalDetailData = {
//   isLoading: boolean;
//   journals?: iJournalDetail[];
//   error: any;
//   mutateDetail: (data?: iJournalDetail[], shouldRevalidate?: boolean) => void;
// }

export const initJournalDetail: iJournalDetail = {
  journalId: 0,
  id: 0,
  coaId: 0,
  description: '',
  debt: 0,
  cred: 0,
  createdAt: moment().format('YYYY-MM-DD HH:mm'),
  updatedAt: moment().format('YYYY-MM-DD HH:mm')
}

// export const useJournalDetail = (id: number): hookJournalDetailData => {
  
//   const url = `/api/journal-detail/${id}`;
//   const { data, error, mutate: mutateDetail } = useSWR<iJournalDetail[]>(url, fetcher, mutateOption);

//   return {
//     isLoading: !error && !data,
//     journals: data,
//     error: error,
//     mutateDetail: mutateDetail
//   } as hookJournalDetailData;
// }

export type JournalOrderPaymentType = {
  data: AsyncListData<iJournalDetail>;
  update: (journalId: number,
    journalDetails: iJournalDetail[],
    deletedJournalDetailIds: number[],
    orderDetails: iOrder[],
    deletedOrderDetailIds: number[]) => Promise<Boolean>
}

export function useJournalOrderPayment(journalId: number, callback: (res: iJournalDetail[]) => void): JournalOrderPaymentType {
  const data = useAsyncList<iJournalDetail>({
    async load({ signal }) {
      let res = await fetch(`/api/journal-detail/get-by-journal/${journalId}`, {
        signal,
      })
      let json: iJournalDetail[] | any = await res.json()
      //console.log(json)
      callback(json);
      return { items: json }
    },
    getKey: (item: iJournalDetail) => item.id,
  })

  return {
    data: data,
    // remove: _remove,
    // insert: _insert,
    update: _update
  }
}

async function _update(journalId: number, 
  journalDetails: iJournalDetail[], 
  deletedJournalDetailIds: number[], 
  orderDetails: iOrder[],
  deletedOrderDetailIds: number[]): Promise<Boolean> {
  const url = `/api/journal/order-details/update/${journalId}`

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      journalDetails: journalDetails,
      deletedJournalDetailIds: deletedJournalDetailIds,
      orderDetails: orderDetails.filter((x) => x.isChanged),
      deletedDetailIds: deletedOrderDetailIds,
    }),
  }

  const result = await fetch(url, fetchOptions)

  return result.status === 200;
}