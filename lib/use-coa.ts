import { iCoa, linkableCoa, postableCoa } from "../components/interfaces";
import { useAsyncList } from '@react-stately/data';

export const initCoa: iCoa = {
  parentId: 0,
  id: 0,
  code: 0,
  name: '',
  taxId: 0,
  linkable: linkableCoa.NONE,
  postable: postableCoa.NONE,
  description: '',
}

export const useCOA = () => {
  return useAsyncList<iCoa>({
    async load({ signal }) {
      const res = await fetch('/api/coa', { signal });
      const json: iCoa[] | any = await res.json();

      return { items: [initCoa, ...json] };
    },
    getKey: (item: iCoa) => item.id,
  });
}