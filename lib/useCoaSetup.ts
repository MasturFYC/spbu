import { iLinkCoa } from '@components/interfaces'
import { useAsyncList, AsyncListData } from '@react-stately/data'


export type LinkedCoaType = {
  data: AsyncListData<iLinkCoa>;
  update: (p: iLinkCoa) => Promise<number>;
  insert: (p: iLinkCoa) => Promise<number>;
  remove: (code: string, id: number) => Promise<number>;
}

export const useLinkedCoa = (code: string): LinkedCoaType => {
  return {
    data: useAsyncList<iLinkCoa>({
      async load({ signal }) {
        const res = await fetch(`/api/coa-link/${code}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })

        signal;

        const json: iLinkCoa[] | any = await res.json()
        //const c = json[0]
        //console.log(code, json)
        return { items: json }
      },
      getKey: (item: iLinkCoa) => item.id,
    }),
    update: _update,
    insert: _insert,
    remove: _remove,
  }
}


async function _insert(p: iLinkCoa) {
  const res = await fetch(`/api/coa-link/0`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      data: p
    })
  })

  const json: iLinkCoa = await res.json()
  //console.log(json)

  return json.accId;
}

async function _update(p: iLinkCoa) {
  const res = await fetch(`/api/coa-link/${p.id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      data: p
    })
  })

  const json: iLinkCoa = await res.json()

  return json.accId;
}

async function _remove(code: string, id: number) {
  const res = await fetch(`/api/coa-link/?code=${code}&id=${id}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    }
  })

  const json: iLinkCoa = await res.json()

  return json.id;
}