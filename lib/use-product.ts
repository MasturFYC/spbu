import { initProduct, iProduct } from "../components/interfaces";
import { useAsyncList, AsyncListData } from '@react-stately/data';

export const fetcher = async (url: string) => await fetch(url).then(async (res) => await res.json());


export const comparer = (a: iProduct, b: iProduct) => {
  {
    if (a.parentCode && b.parentCode) {
      if (a.parentCode > b.parentCode) {
        return 1;
      }
      if (b.parentCode > a.parentCode) {
        return -1;
      }
    }
    return 0;
  }
}

export const useProduct = (): AsyncListData<iProduct> => {
  return useAsyncList<iProduct>({
  async load({ signal }) {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    };

      const res = await fetch(`/api/product`, { signal });
      const json: iProduct[] = await res.json();

    return {
      items: res.status === 200 ? [initProduct, ...json.sort(comparer)] : [initProduct],
    };
  },
  getKey: (item: iProduct) => item.id,
});
}