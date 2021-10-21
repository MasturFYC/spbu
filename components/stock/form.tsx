import dynamic from 'next/dynamic'
import Image from 'next/image'

import React, { useCallback, useState } from 'react'
import { AsyncListData, useAsyncList } from '@react-stately/data'
import { TextField, DialogContainer, SearchField } from '@adobe/react-spectrum'

import { dateOnly, iProductSold, iJournal, iOrder, iUserLogin, setRefId, iLinkCoa, iCoa } from '@components/interfaces'
import { dateParam } from '@components/interfaces'
import { initJournal } from '@lib/use-journal'
import { LinkedCoaType, useLinkedCoa } from '@lib/useCoaSetup'
import myLoader from '@lib/image-loader'
import { Label } from '@components/styled-components/Label'
import WaitMe from '@components/ui/wait-me'
import { stockHookData } from '@lib/use-stock'


type rowType = {
  id: number
  name: string
  uid: string
  align: 'start' | 'center' | 'end' | undefined
  width: number
  percent: string
}

export const initDetail: iOrder = {
  journalId: 0,
  id: 0,
  productId: 0,
  typeId: 0,
  qty: 1,
  content: 0,
  debt: 0,
  cred: 0,
  meterDebt: 0,
  meterCred: 0,
  unit: '',
  buyPrice: 0,
  salePrice: 0,
  discount: 0,
  subTotal: 0,
  isNew: true,
  isChanged: false,
  createdAt: dateParam(null),
  updatedAt: dateParam(null),
}

const linkCode = 'STO'

const SetupStock = dynamic(() => import('./form-setup'))

type StockFormParam = {
  stock: iJournal,
  user?: iUserLogin
}

export default function StockForm({ stock, user }: StockFormParam) {
  const [data, setData] = React.useState<iJournal>({} as iJournal)

  React.useEffect(() => {
    let isLoaded = true

    if (isLoaded) {
      setData(stock)
    }

    return () => {
      isLoaded = false
    }
  }, [stock])

  // const products = useAsyncList<iProductSold>({
  //   async load({ signal }) {
  //     let res = await fetch(`/api/product`, { signal })
  //     //let res = await fetch(`/api/product/${user?.spbuId}`, { signal })
  //     let json: iProductSold[] | any = await res.json()

  //     return { items: res.status === 200 ? json : [{} as iProductSold] }
  //   },
  //   getKey: (item: iProductSold) => item.id,
  // })


  return (
    <div className="w-full">
      <div className="w-full">
        <div className="flex flex-row px-4 py-2 items-center gap-x-2">
          <div className="w-full flex text-4x1 font font-bold text-blue-600 mb-2">
            Transaksi [Pembelian]
          </div>
        </div>
        <hr />

        <div className="flex flex-col mt-4">
          <div className="flex px-4 flex-col lg:flex-auto md:flex-auto gap-y-4  md:gap-x-8 lg:gap-x-8 md:flex-row lg:flex-row">
            <div className="flex-1">
              <label aria-label="date-transact" className="flex-1 flex-col gap-y-2">
                <Label>Tanggal:</Label>
                <input
                  autoFocus
                  className={'flex outline-none border-0 w-auto'}
                  type="date"
                  aria-label="date-transact-input"
                  defaultValue={dateOnly(data.dateTransact)}
                  onChange={(e) => onChange('dateTransact', e.target.value)}
                />
              </label>
              <hr className="mt-2" />
            </div>

            <div className="flex-1 flex-col gap-y-2">
              <div>
                <Label>Nomor Transaksi</Label>
              </div>
              <div>{data.proof}</div>
            </div>

            <div className="flex-1 flex-col gap-y-1">
              <div>
                <Label>Pelanggan</Label>
              </div>
              <TextField
                flex
                width="100%"
                isQuiet
                aria-label="Order Customer"
                placeholder={'e.g Customer Name'}
                value={data.tags || ''}
                onChange={(e) => onChange('tags', e)}
              />
            </div>

            <div className="flex-1  flex-col gap-y-2">
              <div>
                <Label>Operator</Label>
              </div>
              <div>{user?.login}</div>
            </div>
          </div>

          {/* <OrderDetailRows
              journalId={data.id}
              productList={products}
              SaveJournal={onSave}
              memo={data.memo}
              searchMode={searchMode}
              setupAccounts={setupCoas.data.items}
            /> */}
        </div>
      </div>

    </div>
  )

  function onChange(label: string, value: string | number) {
    setData((o) => ({ ...o, [label]: value }))
    //journal.setItem(o => ({ ...o, [label]: value }));
  }

  function onSave(
    journalId: number,
    memo: string | undefined,
    callback: (res: iJournal | undefined) => void
  ) {
    return 0;
  }
}
