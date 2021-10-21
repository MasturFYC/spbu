import { useAsyncList } from '@react-stately/data';
import { iCoaParent } from "../components/interfaces";

export const useCoaParent = () => {
  return useAsyncList<iCoaParent>({
    async load({ signal }) {
      const res = await fetch('/api/coa/parent', { signal })
      const json: iCoaParent[] | any = await res.json()

      //      if(res.status === 200 && json.length > 0)
      const initParentCoa: iCoaParent = { id: 0, code: 0, name: 'none' }

      if (res.status === 200) {
        return { items: [initParentCoa, ...json] }
      } else {
        return { items: [initParentCoa] }
      }
    },
    getKey: (item: iCoaParent) => item.id,
  })
}