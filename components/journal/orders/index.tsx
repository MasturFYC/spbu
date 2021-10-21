import dynamic from 'next/dynamic'
import Image from 'next/image'

import React, { useCallback, useState } from 'react'
import { useAsyncList } from '@react-stately/data'
import { TextField, DialogContainer, SearchField } from '@adobe/react-spectrum'

import { dateOnly, iProductSold, iJournal, iOrder, iUserLogin, setRefId } from '../../interfaces'
import JournalContext, { JournalContextParam } from '../../../lib/journal-provider'
import { dateParam } from '../../interfaces'
import { initJournal } from '../../../lib/use-journal'
import { useLinkedCoa } from '@lib/useCoaSetup'
import myLoader from '@lib/image-loader'
import { Label } from '@components/styled-components/Label'
import { OrderDetailRows } from './detail-rows'
import WaitMe from '@components/ui/wait-me'

// type journalFormParam = {
//   journal: iJournal
//   //  onJournalChange?: (p: iJournal) => void;
// }

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

const linkCode = 'ORD'

const SetupOrder = dynamic(() => import('./form-setup'))

type OrderFormParam = {
  user?: iUserLogin
}

export default function OrderForm({ user }: OrderFormParam) {
  const [showChild, setShowChild] = React.useState(false)
  let [isFreeze, setIsFreeze] = React.useState(false)
  let [isOpen, setOpenSetup] = useState(false)
  let setupCoas = useLinkedCoa(linkCode)
  const { journal, source, coa } = React.useContext<JournalContextParam>(JournalContext)
  const [data, setData] = React.useState<iJournal>(initJournal)
  const [txtSearch, setTxtSearch] = useState('')
  const [searchMode, setSearchMode] = useState(false)

  const openSetup = useCallback(() => {
    setOpenSetup(true)
  }, [isOpen])

  const products = useAsyncList<iProductSold>({
    async load({ signal }) {
      let res = await fetch(`/api/product`, { signal })
      //let res = await fetch(`/api/product/${user?.spbuId}`, { signal })
      let json: iProductSold[] | any = await res.json()

      return { items: res.status === 200 ? json : [{} as iProductSold] }
    },
    getKey: (item: iProductSold) => item.id,
  })

  React.useEffect(() => {
    let isLoaded = false

    if (!isLoaded) {
      const d = journal.getItem(source.getSelected)
      if (d && d.id > 0 && d.code === 'ORD') {
        setData(d)
      } else {
        if (d && d.id > 0) source.setSelected(0)
        setData({ ...initJournal, code: linkCode, proof: linkCode })
      }
    }

    return () => {
      isLoaded = true
    }
  }, [journal, source])

  React.useEffect(() => {
    setShowChild(true)
  }, [])

  if (isFreeze || !showChild || setupCoas.data.isLoading) {
    return <WaitMe />
  }

  return (
    <div className="w-full">
      {/* // setupCoas.data.isLoading && <div><WaitMe /></div> */}
      <DialogContainer type={'modal'} onDismiss={() => setOpenSetup(false)} isDismissable>
        {isOpen && <SetupOrder coas={coa} linkedCoas={setupCoas} />}
      </DialogContainer>

      {setupCoas.data.items.length >= 3 ? (
        <div className="w-full bg-white border border-1 border-blue-200 shadow-lg">
          <div className="flex flex-row px-4 py-2 items-center gap-x-2">
            <div className="w-full flex text-4x1 font font-bold text-blue-600 mb-2">
              Transaksi [Penjualan Order]
            </div>
            <div className="flex-1">
              <SearchField
                flex
                width={{ base: '175px', M: '200px', L: '200px' }}
                value={txtSearch}
                placeholder="e.g. jarum super"
                aria-label="Search journal"
                onChange={(e) => setTxtSearch(e)}
                onClear={() => {
                  setSearchMode(false)
                  products.reload()
                }}
                onSubmit={(e) => {
                  searchProduct()
                  setSearchMode(true)
                }}
              />
            </div>
            <div className="w-10 flex justify-center">
              <Image
                onClick={openSetup}
                loader={myLoader}
                src="/icons/setup.svg"
                alt=""
                objectFit="contain"
                className="w-22 h-22 w-full cursor-pointer sm:opacity-0 lg:opacity-100"
                width={22}
                height={22}
              />
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

            <OrderDetailRows
              journalId={data.id}
              productList={products}
              SaveJournal={onSave}
              memo={data.memo}
              searchMode={searchMode}
              setupAccounts={setupCoas.data.items}
            />
          </div>
        </div>
      ) : (
        <p className="p-4 bg-white">
          Tidak dapat melakukan transaksi order karena belum ditentukannya akun pendapatan,
          pembayaran, dan piutang. Setting lebih dulu akun tersebut, click{' '}
          <span
            className="cursor-pointer text-blue-600 text-underlined"
            onClick={() => setOpenSetup(true)}
          >
            Setup Account
          </span>{' '}
          untuk menentukan akun-akun tersebut.
        </p>
      )}
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
    if (journalId === 0) {
      source.insert({ ...data, memo: memo }, (res) => {
        if (res) {
          callback(res)
          //          setData(res);
        }
      })
    } else {
      source.update(
        journalId,
        { ...data, memo: memo, proof: setRefId(journalId, data.code) },
        (res) => {
          if (res) {
            callback(res)
          }
        }
      )
    }
  }

  // async function saveJournal(
  //   journalId: number,
  //   details: iOrder[],
  //   memo: string | undefined,
  //   deletedDetailIds: number[],
  //   journalDetails: iJournalDetail[],
  //   deletedJournalDetailIds: number[]
  // ) {
  //   setIsFreeze(true)
  //   onSave(journalId, memo, async (res) => {
  //     if (res) {
  //       const url = `/api/journal/order-details/update/${res.id}`
  //       const fetchOptions = {
  //         method: 'POST',
  //         headers: {
  //           'Content-type': 'application/json; charset=UTF-8',
  //         },
  //         body: JSON.stringify({
  //           orderDetails: details.filter((x) => x.isChanged),
  //           journalDetails: journalDetails,
  //           deletedJournalDetailIds: deletedJournalDetailIds,
  //           deletedDetailIds: deletedDetailIds,
  //         }),
  //       }

  //       const result = await fetch(url, fetchOptions)

  //       if (result.status === 200) {
  //         //setData(res);
  //       }

  //       if (journalId === 0) {
  //         journal.insert(0, res)
  //       } else {
  //         journal.update(journalId, res)
  //       }
  //       source.gotoPage('journal')
  //     } else {
  //       alert('Data journal tidak bisa disimpan!')
  //     }
  //   })
  //   //setIsFreeze(false)
  // }

  async function searchProduct() {
    let res = await fetch(`/api/product/search/${txtSearch}`)
    let json: iProductSold[] | any = await res.json()

    if (res.status === 200) {
      products.setSelectedKeys('all')
      products.removeSelectedItems()
      products.append(...json)
    }
  }
}
