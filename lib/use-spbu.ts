import { iSpbu } from "../components/interfaces";
import { useAsyncList, AsyncListData } from '@react-stately/data';

const initSpbu: iSpbu = {
  id: 0,
  name: '',
  code: 'none',
};

export const useSpbu = (): AsyncListData<iSpbu> => {
  return useAsyncList<iSpbu>({
    async load({ signal }) {

      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      };

      const res = await fetch(`/api/spbu`, fetchOptions);
      const json: iSpbu[] | any = await res.json();

      return {
        items: [...json, initSpbu]
      };
    },
    getKey: (item: iSpbu) => item.id,
  });
}
