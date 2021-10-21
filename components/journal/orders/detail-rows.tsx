import React, { EventHandler, useCallback, useState } from 'react'
//import { HotKeys } from 'react-hotkeys'
import { AsyncListData } from '@react-stately/data'
import { useAsyncList } from '@react-stately/data'
import {
  Button,
  Text,
  NumberField,
  TextArea,
  ComboBox,
  Item,
  ButtonGroup,
  ActionButton,
} from '@adobe/react-spectrum'
import AddTo from '@spectrum-icons/workflow/AddTo'
import AddItem from '@spectrum-icons/workflow/Add'
import RemoveFrom from '@spectrum-icons/workflow/Remove'
import {
  iProductSold,
  iOrder,
  generateId,
  initProduct,
  iLinkCoa,
  linkableCoa,
  iJournalDetail,
  iJournal
} from '../../interfaces'
import JournalContext, { JournalContextParam } from '../../../lib/journal-provider'
import { Label } from '@components/styled-components/Label'
import { FormatNumber } from '@lib/format'
import { initDetail } from './index'
import useClickOutside from '@components/useClickOutside'
import { initJournalDetail, useJournalOrderPayment } from '@lib/use-journal-detail'
import moment from 'moment'
import WaitMe from '@components/ui/wait-me'

type RowsParam = {
  memo: string | undefined
  productList: AsyncListData<iProductSold>
  SaveJournal: (
    journalId: number,
    //    details: iOrder[],
    memo: string | undefined,
    //    deletedetailIds: number[],
    //    journalDetails: iJournalDetail[],
    //    deletedJournalDetailIds: number[]
    callback: (res: iJournal | undefined) => void
  ) => void
  journalId: number
  searchMode: boolean
  setupAccounts: iLinkCoa[]
}

export function OrderDetailRows({
  journalId,
  SaveJournal,
  memo: oldMemo,
  productList,
  searchMode,
  setupAccounts,
}: RowsParam) {
  const refAdd =
    React.useRef<import('@react-types/shared').FocusableRefValue<HTMLElement, HTMLElement>>(null)

  const [isBarcode, setIsBarcode] = useState(true)
  const [showChild, setShowChild] = React.useState(false)
  const { coa, source } = React.useContext<JournalContextParam>(JournalContext)
  let [ids, setIds] = React.useState<number[]>([])
  let [total, setTotal] = React.useState({
    debt: 0,
    cred: 0,
    enableButton: false,
  })
  let [message, setMessage] = React.useState('')
  let [newMemo, setNewMemo] = React.useState<string | undefined>()
  let [allowFocus, setAllowFocus] = React.useState(false)

  let [totalReceive, setTotalReceive] = useState(0) // (K) 1000
  let [totalPayment, setTotalPayment] = useState(0) // (D) 800
  let [totalPiutang, setTotalPiutang] = useState(0) // (D) 200
  let [disableKeys, setDisableKeys] = useState<Iterable<React.Key>>([])
  let [coaPaymentId, setCoaPaymentId] = useState(0)
  let [isSaving, setIsSaving] = useState(false)
  //let [journalDetails, setJournalDetails] = useState<JournalOrderPaymentType>({} as JournalOrderPaymentType)

  const disableCoaPayments = useCallback((): number[] => {
    if (setupAccounts.length === 0) return []
    return [setupAccounts[0].accId, setupAccounts[2].accId]
  }, [setupAccounts])

  /*
  useAsyncList<iJournalDetail>({
    async load({ signal }) {
      let res = await fetch(`/api/journal-detail/get-by-journal/${journalId}`, {
        signal,
      })
      let json: iJournalDetail[] | any = await res.json()
      if (res.status === 200) {
        setTotalReceive(json[0].cred)
        setTotalPayment(json[1].debt)
        if (json.length > 2) setTotalPiutang(json[2].debt)
      }
      return { items: json }
    },
    getKey: (item: iJournalDetail) => item.id,
  })
*/

  React.useEffect(() => {
    let isLoaded = true

    // const loadJournalDetails = () => {
    //   const test = useJournalOrderPayment(journalId);

    //   setJournalDetails(test)
    //   console.log(test)
    // }

    if (isLoaded) {
      setDisableKeys(disableCoaPayments())
      setNewMemo(oldMemo)
      // if (journalDetails.data.items.length > 0) {
      //   setTotalReceive(journalDetails.data.items[0].cred)
      //   setTotalPayment(journalDetails.data.items[1].debt)
      //   if (journalDetails.data.items.length > 2) setTotalPiutang(journalDetails.data.items[2].debt)
      // }
    }

    return () => {
      isLoaded = false
    }
  }, [oldMemo, disableCoaPayments])

  React.useEffect(() => {
    setShowChild(true)
  }, [])

  let details = useAsyncList<iOrder>({
    async load({ signal }) {
      let res = await fetch(`/api/journal/order-details/${journalId}`, {
        signal,
      })
      let json: iOrder[] | any = await res.json()
      //setTotal(json.reduce((a:number,b: iOrder)=>a+b.subTotal, 0))
      return {
        items: res.status === 200 ? json : [{ ...initDetail, typeId: 2, journalId: journalId }],
      }
    },
  })

  let journalDetails = useJournalOrderPayment(journalId, (res) => {
    //console.log((res && res.length > 0))
    if (res && res.length > 0) {
      setTotalReceive(res[0].cred)
      setTotalPayment(res[1].debt)
      if (res.length > 2) setTotalPiutang(res[2].debt)
      //console.log(res)
    }
  })


  if (!showChild) {
    return <WaitMe />
  }



  return (
    <div className="w-full">
      {searchMode ? (
        <div className="w-full mt-8">
          <hr />
          {
            productList.isLoading ? <WaitMe /> :
              productList.items.map((p) => (
                <div className="w-full8" key={p.id}>
                  <div className={`flex mx-4 py-1 flex-row gap-x-4 ${details.items.filter((x) => x.productId === p.id)[0] ? '' : 'hover:bg-blue-50'}`}>
                    <div className="flex-1">{p.barcode}</div>
                    <div className="flex-1">{p.name}</div>
                    <div className="flex-1">Harga: {FormatNumber(p.salePrice)} / {p.unit}</div>
                    <div className="flex-1">{p.description}</div>
                    {/* <input
                  defaultValue={0}
                  type="number"
                  className="w-16 outline-none rounded-full pl-4 pr-2 border border-1 border-gray-400"
                  onChange={(e) => {
                    p.firstStock = +e.target.value
                  }}
                /> */}
                    <button
                      disabled={details.items.filter((x) => x.productId === p.id).length > 0}
                      className={`select-none h-6 bg-green-600 w-16 text-white font-medium rounded-full outline-none ring-0 border border-2 border-green-700 focus:ring-2
                hover:bg-green-700 hover:border-green-800 hover:ring-0
                active:bg-green-800 active:border-green-900 active:ring-0
                disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:border-0 disabled:text-gray-700 disabled:border-gray-400 border border-gray-600`}
                      onClick={() => addDetails(p)}
                    >
                      <AddItem size="S" marginTop="-6px" />
                    </button>
                  </div>
                  <hr />
                </div>
              ))}
        </div>
      ) : (
        <div className="w-full mt-8 my-4">
          <div className="mt-16">
            <div className="hidden md:flex lg:flex flex-col md:flex-row lg:flex-row gap-4 mb-2 mx-4">
              <div className="w-80 flex text-left">
                <Label>{isBarcode ? 'BARCODE' : 'NAMA BARANG'}</Label>
              </div>
              {isBarcode && (
                <div className="flex w-full text-left">
                  <Label>NAMA BARANG</Label>
                </div>
              )}
              <div className="flex gap-x-2 w-1/2">
                <div className="w-16 pr-2 text-right">
                  <Label>QTY</Label>
                </div>
                <div className="w-10 text-left">
                  <Label>UNIT</Label>
                </div>
                <div className="w-24 text-right">
                  <Label>HARGA</Label>
                </div>
                <div className="w-20 text-right">
                  <Label>DISCOUNT</Label>
                </div>
                <div className="w-24 text-right">
                  <Label>SUBTOTAL</Label>
                </div>
                <div className="w-8"> </div>
              </div>
            </div>
            <hr />

            {
              journalDetails.data.isLoading || details.isLoading ?
                <WaitMe />
                :
                details.items.map((item, i) => (
                  <div
                    key={item.id}
                    className={`ative:bg-blue-50 ${i % 2 === 0 && 'bg-gray-50'
                      } hover:bg-blue-50 px-4`}
                  >
                    <DetailRow
                      key={item.id}
                      item={item}
                      isBarcode={isBarcode}
                      productList={productList}
                      updateBarcode={updateBarcode}
                      allowFocus={allowFocus}
                      details={details}
                      setMessage={setMessage}
                      updateQty={updateQty}
                      refAdd={refAdd}
                      updateDiscount={updateDiscount}
                      setIds={setIds}
                      CalculateTotal={CalculateTotal}
                    />
                  </div>))}
          </div>

          <div className="w-full mt-8 mx-4">
            <div className="flex flex-row">
              <div className="flex w-1/2">
                <Button
                  ref={refAdd}
                  variant={'primary'}
                  onPress={() => {
                    setAllowFocus(true)
                    setTotal((prev) => ({ ...prev, enableButton: false }))
                    if (details) {
                      const newId = generateId(1, 100)
                      details.append({
                        ...initDetail,
                        id: newId,
                        journalId: journalId,
                        typeId: 2, // 2 for order
                      })
                      details.selectedKeys = new Set([newId])
                    }
                  }}
                >
                  <AddTo size="S" aria-label="Tambah item" />
                  <Text>Tambah Item</Text>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-red-600 py-4 w-full mx-4">{message}</div>

      <div className="flex flex-col md:flex-row lg:flex-row mx-4">
        <div className="flex-1">
          <label className="flex flex-col px-4 py-2">
            <Label>Memo</Label>
            <TextArea
              placeholder="e.g. catatan transaksi"
              width="auto"
              maxLength={256}
              isQuiet
              aria-label="memo"
              value={newMemo || ''}
              onChange={(e) => setNewMemo(e)}
            />
          </label>
        </div>
        <div className="flex-1 w-0 h-0 md:w-1/4 lg:w-1/4" />

        <div className="flex-1 flex-col gap-y-2 w-full md:mt-0 lg:mt-0 px-4 py-2 border border-transparent rounded hover:boder-1 hover:border-blue-500 hover:shadow-lg">
          <div className="flex flex-col gap-y-2 mt-4">
            <Label>{getAccountIdName(setupAccounts[0].accId)} (K)</Label>
            <div className="font font-bold select-all">{FormatNumber(totalReceive)}</div>
          </div>
          <div>
            <Label><span>Akun Penerimaan Pendapatan (D)</span>
              <ComboBox
                isQuiet
                flex
                width="100%"
                placeholder={'e.g. Pilih akun'}
                aria-label="Account List"
                disabledKeys={disableKeys}
                defaultSelectedKey={getDafaultCoaPayment()}
                defaultItems={coa.items.filter((x) => x.linkable === linkableCoa.LINKABLE)}
                onSelectionChange={(e) => {
                  setCoaPaymentId(+e)

                  //setupAccounts[1].accId = +e;
                }}
              >
                {(item) => <Item>{`${item.code.toString().padStart(4, '0')} - ${item.name}`}</Item>}
              </ComboBox>
            </Label>
          </div>

          <div>
            <NumberField
              width="100%"
              validationState={totalPayment > 0 ? 'valid' : 'invalid'}
              isQuiet
              hideStepper
              aria-label={'Account Payment'}
              value={totalPayment}
              onChange={(e) => paymentChanged(e)}
            />
          </div>
          <div className="mt-4">
            <Label>{getAccountIdName(setupAccounts[2].accId)} (D)</Label>
          </div>
          <div>{FormatNumber(totalPiutang)}</div>
        </div>
      </div>

      <div className="mt-8 mb-4 flex mx-4">
        <div className="flex w-full items-center">
          <Button
            isDisabled={isSaving}
            variant={'secondary'}
            onPress={() => source.gotoPage('journal')}
            //isDisabled={journalId === 0}
            minWidth={{ M: 'size-1200', L: 'size-1200' }}
          >
            Batal
          </Button>
          <Button
            isDisabled={isSaving}
            minWidth={{ M: 'size-1200', L: 'size-1200' }}
            marginStart="size-100"
            onPress={() => {
              if (details.items.filter((x) => x.productId === 0).length > 0) {
                setMessage('Product tidak boleh kosong atau sama!')
              } else {
                setMessage('')
                onSave()
                //SaveJournal(journalId, details, newMemo, ids)
              }
            }}
            variant="cta"
          >
            Simpan
          </Button>
          {isSaving && <div className="flex w-28"><WaitMe /></div>}
        </div>
        <ButtonGroup>
          <Button
            minWidth={{ M: 'size-1200', L: 'size-1200' }}
            variant={'negative'}
            onPress={() =>
              source.remove(journalId, (res) => {
                if (res) {
                  source.gotoPage('journal')
                }
              })
            }
            isDisabled={journalId === 0 || isSaving}
          >
            Hapus
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )

  function addDetails(p: iProductSold) {
    details.append({
      ...initDetail,
      typeId: 2,
      productId: p.id,
      id: generateId(1, 100),
      qty: 1,
      name: p.name,
      unit: p.unit,
      barcode: p.barcode,
      content: p.content,
      buyPrice: p.buyPrice,
      salePrice: p.salePrice,
      subTotal: p.salePrice,
      isChanged: true
    })
    CalculateTotal(p.salePrice)
  }

  function onSave() {
    let deletedJournalDetails: number[] = []
    //const grandTotal = details.items.reduce((s, f) => s + f.subTotal, 0)
    //console.log(details.items)
    const newJournalDetails: iJournalDetail[] = []

    if (journalId > 0 && journalDetails.data.items.length > 0) {
      const d0 = journalDetails.data.items[0]
      newJournalDetails.push({
        ...d0,
        coaId: setupAccounts[0].accId,
        cred: totalReceive,
        debt: 0,
        isChanged: true,
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
      })

      let d1 = journalDetails.data.items[1]
      newJournalDetails.push({
        ...d1,
        coaId: coaPaymentId === 0 ? setupAccounts[1].accId : coaPaymentId, //coaPaymentId, //setupAccounts[1].accId,
        debt: totalPayment,
        cred: 0,
        isChanged: true,
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
      })

      if (totalPiutang === 0) {
        if (journalDetails.data.items.length > 2) {
          deletedJournalDetails.push(journalDetails.data.items[2].id)
        }
      } else {
        if (journalDetails.data.items.length > 2) {
          let d2 = journalDetails.data.items[2]
          newJournalDetails.push({
            ...d2,
            //coaId: setupAccounts[2].accId,
            debt: totalPiutang,
            cred: 0,
            isChanged: true,
            isNew: false,
            updatedAt: moment().format('YYYY-MM-DD HH:mm'),
          })
        } else {
          newJournalDetails.push({
            ...initJournalDetail,
            id: 3,
            debt: totalPiutang,
            cred: 0,
            isNew: true,
            isChanged: true,
            description: getAccountName(setupAccounts[2].accId),
            coaId: setupAccounts[2].accId,
            journalId: journalId,
          })
        }
      }
    } else {
      newJournalDetails.push({
        ...initJournalDetail,
        id: 1,
        coaId: setupAccounts[0].accId,
        cred: totalReceive,
        debt: 0,
        description: getAccountName(setupAccounts[0].accId),
        journalId: journalId,
        isChanged: true,
        isNew: true,
      })
      newJournalDetails.push({
        ...initJournalDetail,
        id: 2,
        coaId: coaPaymentId === 0 ? setupAccounts[1].accId : coaPaymentId,
        debt: totalPayment,
        cred: 0,
        journalId: journalId,
        description: getAccountName(coaPaymentId === 0 ? setupAccounts[1].accId : coaPaymentId),
        isChanged: true,
        isNew: true,
      })
      if (totalPiutang > 0) {
        newJournalDetails.push({
          ...initJournalDetail,
          id: 3,
          debt: totalPiutang,
          cred: 0,
          description: getAccountName(setupAccounts[2].accId),
          coaId: setupAccounts[2].accId,
          journalId: journalId,
          isChanged: true,
          isNew: true,
        })
      }
    }
    //ids, newJournalDetails, deletedJournalDetails
    // details.items
    //console.log(details.items)
    setIsSaving(true)
    SaveJournal(journalId, newMemo, async (res) => {
      if (res) {
        const test = await journalDetails.update(journalId, newJournalDetails, deletedJournalDetails, details.items, ids);
        if (test) {
          setIsSaving(false)
          source.gotoPage("journal")
        }
      }
    })
  }

  function CalculateTotal(subtract: number, isRecalc?: boolean) {
    let grandTotal = 0
    if (isRecalc) {
      grandTotal = details.items.reduce((a, b) => a + b.subTotal, 0)
    } else {
      grandTotal = totalReceive + subtract
    }
    setTotalReceive(grandTotal)    
    setTotalPiutang(grandTotal - totalPayment)
  }

  function paymentChanged(e: number) {
    setTotalPayment(e)
    //const grandTotal = details.items.reduce((s, f) => s + f.subTotal, 0)
    //setTotalReceive(grandTotal)
    setTotalPiutang(totalReceive - e)
  }

  function getDafaultCoaPayment(): React.Key | undefined {
    if (journalDetails.data.items.length === 0) {
      return setupAccounts[1].accId
    }
    const selId = journalDetails.data.items[1].coaId
    return selId
  }

  function getAccountIdName(accId: number) {
    const c = coa.items.filter((o) => o.id === accId)[0]
    if (c) {
      return c.code.toString().padStart(4, '0') + ' - ' + c.name
    }
    return ''
  }

  function getAccountName(accId: number) {
    const c = coa.items.filter((o) => o.id === accId)[0]
    if (c) {
      return c.name
    }
    return ''
  }

  function updateQty(item: iOrder, e: number) {
    item.qty = e
    item.subTotal = (item.salePrice - item.discount) * item.qty
    item.isChanged = true
    details.update(item.id, item)
    CalculateTotal(0, true)
  }

  function updateDiscount(item: iOrder, e: number) {
    item.discount = e
    item.subTotal = (item.salePrice - item.discount) * item.qty
    item.isChanged = true
    details.update(item.id, item)
    CalculateTotal(0, true)
  }
  function updateBarcode(item: iOrder, p: iProductSold) {
    item.barcode = p.barcode
    item.productId = p.id
    item.name = p.name
    item.salePrice = p.salePrice
    item.buyPrice = p.buyPrice
    item.content = p.content
    item.unit = p.unit
    item.subTotal = (p.salePrice - item.discount) * item.qty
    item.isChanged = true
    details.update(item.id, item)
    CalculateTotal(0, true)
  }
}

type DetailRowType = {
  item: iOrder
  isBarcode: boolean
  //isDirty: boolean,
  //setIsDirty: React.Dispatch<React.SetStateAction<boolean>>,
  productList: AsyncListData<iProductSold>
  //barcode: string,
  updateBarcode: (item: iOrder, p: iProductSold) => void
  //setBarcode: React.Dispatch<React.SetStateAction<string>>,
  allowFocus: boolean
  details: AsyncListData<iOrder>
  setMessage: React.Dispatch<React.SetStateAction<string>>
  updateQty: (item: iOrder, e: number) => void
  refAdd: React.RefObject<import('@react-types/shared').FocusableRefValue<HTMLElement, HTMLElement>>
  updateDiscount: (item: iOrder, e: number) => void
  setIds: React.Dispatch<React.SetStateAction<number[]>>
  CalculateTotal: (subtract: number, isRecalc?: boolean) => void
}

function DetailRow({
  item,
  isBarcode,
  //isDirty,
  //setIsDirty,
  productList,
  //barcode: string,
  updateBarcode,
  //setBarcode: React.Dispatch<React.SetStateAction<string>>,
  allowFocus,
  details,
  updateQty,
  refAdd,
  updateDiscount,
  setIds,
  setMessage,
  CalculateTotal,
}: // refQty: React.RefObject<HTMLInputElement>,
  // refDiscount: React.RefObject<HTMLInputElement>
  DetailRowType): JSX.Element {
  //const mainRef = React.createRef<HTMLDivElement>()

  const [barcode, setBarcode] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const refQty = React.createRef<HTMLInputElement>() //.useRef<HTMLInputElement>(null);
  const refDiscount = React.createRef<HTMLInputElement>() //<HTMLInputElement>(null);
  const keyMap = {
    MOVE_UP: 'up',
  }

  const moveUp = (event: any) => {
    alert(event)
    console.log('Move up hotkey called!')
  }

  const handlers = {
    MOVE_UP: (event: any) => moveUp,
  }

  // useClickOutside(mainRef, () => {
  //   if (item.isNew && item.productId === 0) {
  //     details.remove(item.id)
  //   }
  // })

  return (
    <>
      <div
        //ref={mainRef}
        className="flex flex-auto flex-col md:flex-row lg:flex-row gap-4 py-1"
      >
        <div className="w-80 flex text-left">
          {isBarcode ? (
            // <HotKeys keyMap={keyMap} handlers={handlers}>
            <input
              onBlur={handleBlur}
              type="text"
              maxLength={25}
              className="border-0 bg-transparent flex-none outline-none w-full ring-0"
              autoFocus={allowFocus}
              aria-label="Product Barcode"
              defaultValue={item.barcode}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  const p = productList.items.filter((x) => x.barcode === barcode)[0]
                  const r = refQty.current
                  if (r && p) {
                    r.focus()
                    r.select()
                  }
                }
              }}
              onChange={(e) => {
                setIsDirty(true)
                setBarcode(e.target.value)
              }}
            />
          ) : (
            // </HotKeys>
            <ComboBox
              isQuiet
              autoFocus={allowFocus}
              flex="auto"
              placeholder={'e.g. Pilih salah satu produk'}
              aria-label="Product List"
              defaultItems={productList.items}
              defaultSelectedKey={item.productId}
              // val={item.coaId}
              // @ts-ignore
              onSelectionChange={(e) => {
                if (
                  details.items.filter((x) => x.productId !== item.id && x.productId === +e)
                    .length > 0
                ) {
                  setMessage('Tidak boleh ada produk yg sama dalam satu transaksi.')
                  item.productId = 0
                  item.unit = ''
                  item.cred = 0
                  item.debt = 0
                  item.buyPrice = 0
                  item.salePrice = 0
                  item.subTotal = 0
                } else {
                  const selProduct = productList.getItem(+e)
                  setMessage('')
                  item.productId = +e
                  item.isChanged = true
                  item.unit = selProduct.unit
                  item.buyPrice = selProduct.buyPrice
                  item.salePrice = selProduct.salePrice
                  item.content = selProduct.content
                  item.subTotal = (item.salePrice - item.discount) * item.qty
                  item.isChanged = true
                }
                details.update(item.id, item)
              }}
            >
              {(product) => (
                <Item>{`${product.code.toString().padStart(4, '0')} - ${product.name} (${product.stock?.debt || 0
                  })`}</Item>
              )}
            </ComboBox>
          )}
        </div>

        {isBarcode && <div className="flex w-full text-left text-gray-600">{item.name}</div>}
        <div className="flex gap-x-2 w-1/2">
          <div className="w-16 text-right">
            <input
              type="text"
              className="border-0 bg-transparent outline-none w-full ring-0 text-right"
              ref={refQty}
              aria-label={'Detail Qty'}
              defaultValue={item.qty}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  const r = refDiscount.current
                  if (r) {
                    r.focus()
                    r.select()
                  }
                }
              }}
              onChange={(e) => {
                const s = e.target.value
                const v = isNaN(+s) ? 0 : +s
                updateQty(item, v)
              }}
            />
          </div>
          <div className="w-10 text-left">{item.unit}</div>
          <div className="w-24 text-right">
            <span>{FormatNumber(item.salePrice)}</span>
          </div>
          <div className="w-20 text-right">
            <input
              type="text"
              className="border-0 bg-transparent pr-2 outline-none w-full ring-0 text-right"
              aria-label={'Detail Discount'}
              defaultValue={item.discount}
              ref={refDiscount}
              onKeyUp={(e) => {
                e.preventDefault()

                if (e.key === 'Enter') {
                  const r = refAdd.current
                  if (r) {
                    r.focus()
                  }

                  if (item.isNew) {
                    const newId = generateId(1, 100)

                    details.append({
                      ...initDetail,
                      id: newId,
                      journalId: item.journalId,
                      typeId: 2, // 2 for order
                    })

                    details.selectedKeys = new Set([newId])
                  }
                }
              }}
              onChange={(e) => {
                const s = e.target.value
                const v = isNaN(+s) ? 0 : +s
                updateDiscount(item, v)
              }}
            />
          </div>
          <div className="w-24 text-right font font-bold">
            <span>{FormatNumber(item.subTotal)}</span>
          </div>
          <div className="w-8">
            <ActionButton
              isQuiet
              height="auto"
              width="auto"
              onPress={(e) => {
                if (!item.isNew) {
                  setIds((p) => [...p, item.id])
                }
                details.remove(item.id)
                CalculateTotal(-item.subTotal)
              }}
            >
              <RemoveFrom size="S" />
            </ActionButton>
          </div>
        </div>
      </div>
      <hr />
    </>
  )

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (isDirty) {
      setIsDirty(false)
      const p = productList.items.filter((x) => x.barcode === barcode)[0]
      updateBarcode(item, p || initProduct)
    }
  }
}
