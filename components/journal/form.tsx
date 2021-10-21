import React from 'react'
import { AsyncListData } from '@react-stately/data'
import { useAsyncList } from '@react-stately/data'
import {
  Flex,
  Button,
  Text,
  TextField,
  NumberField,
  TextArea,
  ComboBox,
  Item,
  ButtonGroup,
  View,
  ActionButton,
  ProgressCircle,
} from '@adobe/react-spectrum'
import AddTo from '@spectrum-icons/workflow/AddTo'
import RemoveFRom from '@spectrum-icons/workflow/Remove'

import {
  dateOnly,
  iJournal,
  iJournalDetail,
  iUserLogin,
  postableCoa,
  setRefId,
} from '../interfaces'
import JournalContext, { JournalContextParam } from '../../lib/journal-provider'
import { initJournalDetail } from '../../lib/use-journal-detail'
import { dateParam } from '../interfaces'
import { initJournal } from '../../lib/use-journal'

type journalFormParam = {
  journal: iJournal
  //  onJournalChange?: (p: iJournal) => void;
}
type rowType = {
  id: number
  name: string
  uid: string
  align: 'start' | 'center' | 'end' | undefined
  width: number
  percent: string
}

const initDetail: iJournalDetail = {
  journalId: 0,
  id: 0,
  coaId: 0,
  debt: 0,
  cred: 0,
  description: 'Keteterangan',
  createdAt: dateParam(null),
  updatedAt: dateParam(null),
}

type JournalFormParam = {
  user?: iUserLogin
}
export default function JournalForm({ user }: JournalFormParam) {
  const [showChild, setShowChild] = React.useState(false)
  let [isFreeze, setIsFreeze] = React.useState(false)

  const { journal, source } = React.useContext<JournalContextParam>(JournalContext)
  const [data, setData] = React.useState<iJournal>({
    ...initJournal,
    userId: user?.userId || 0,
  })

  React.useEffect(() => {
    let isLoaded = false

    if (!isLoaded) {
      const d = journal.getItem(source.getSelected)
      setData(d)
    }

    return () => {
      isLoaded = true
    }
  }, [journal, source])

  React.useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild) {
    // You can show some kind of placeholder UI here
    return null
  }

  const onChange = (label: string, value: string | number) => {
    setData((o) => ({ ...o, [label]: value }))
    //journal.setItem(o => ({ ...o, [label]: value }));
  }

  const onSave = (
    journalId: number,
    memo: string | undefined,
    callback: (res: iJournal | undefined) => void
  ) => {
    // .log('selected id:', data.id);
    if (journalId === 0) {
      source.insert({ ...data, memo: memo }, (res) => {
        if (res) {
          callback(res)
          //          setData(res);
        }
      })
    } else {
      source.update(journalId, { ...data, memo: memo }, (res) => {
        if (res) {
          callback(res)
          //journal.update(journalId, res);
        }
      })
    }
  }

  const saveJournal = async (
    journalId: number,
    details: AsyncListData<iJournalDetail>,
    memo: string | undefined,
    ids: number[]
  ) => {
    const detailsToUpdate = [...details.items.filter((x) => x.isChanged)]

    //.log(details);
    setIsFreeze(true)
    onSave(journalId, memo, async (res) => {
      if (res) {
        //.log('updated:', res, ids);
        if (detailsToUpdate.length > 0 || ids.length > 0) {
          const url = `/api/journal-detail/${res.id}`
          const fetchOptions = {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              details: detailsToUpdate,
              ids: ids,
            }),
          }

          const result = await fetch(url, fetchOptions)
          //const data: iJournal | any = await result.json();

          //.log(data);
          const data = await result.json()

          if (data && result.status === 200) {
            //
          }
        }

        if (journalId === 0) {
          journal.insert(0, res)
        } else {
          journal.update(journalId, res)
        }
        source.gotoPage('journal')
      } else {
        alert('Data journal tidak bisa disimpan!')
      }
    })
  }

  if (isFreeze) {
    return (
      <Flex marginTop="size-500" alignItems="center" alignSelf="center" justifyContent="center">
        <ProgressCircle aria-label="Loading…" isIndeterminate />
      </Flex>
    )
  }

  return (
    <View
      backgroundColor="gray-50"
      borderColor={'gray-400'}
      borderWidth={'thin'}
      borderTopEndRadius="medium"
      borderTopStartRadius="medium"
    >
      <View
        flex
        paddingY="size-100"
        paddingX="size-300"
        backgroundColor="orange-400"
        borderTopStartRadius="medium"
        marginBottom="size-300"
        borderTopEndRadius="medium"
      >
        <Text>
          <h2>Transaksi [Jurnal Umum]</h2>
          <style jsx>
            {`
              h2 {
                color: #fff;
                padding: 0;
                margin: 0;
              }
            `}
          </style>
        </Text>
      </View>
      <View
        paddingX={{ base: 'size-100', M: 'size-200', L: 'size-300' }}
        paddingBottom={{ base: 'size-100', M: 'size-200', L: 'size-300' }}
      >
        <Flex
          direction={{ base: 'column', M: 'row', L: 'row' }}
          maxWidth={{ base: '100%', M: 'auto', L: 'auto' }}
          gap={{ base: 'size-100', M: 'size-300', L: 'size-1600' }}
          wrap
        >
          <View>
            <div>
              <label aria-label="date-transact">
                <span>
                  Tanggal:
                  <br />
                </span>
                <input
                  autoFocus
                  type="date"
                  aria-label="date-transact-input"
                  value={dateOnly(data.dateTransact)}
                  onChange={(e) => onChange('dateTransact', e.target.value)}
                />
              </label>
              <style jsx>{`
                span {
                  font-size: 0.75rem;
                }
                div {
                  display: block;
                }
                input {
                  border: none;
                  border-bottom: 1px solid #cecece;
                  font-family: inherit;
                  width: calc(100% - 0.7rem);
                  // border-radius: 0.3rem;
                  margin: auto;
                  margin-top: 3px;
                  background-color: 'none';
                  padding: 0.3rem;
                  outline: : none;
                  //border: 1px solid #cecece;
                }
                
                input:focus {
                  border: none  !important;
                  outline: : none !important;
                  border-bottom: 1px solid #01a9df;
                  box-shadow: 0 none !important;
                  -webkit-box-shadow: none;
                        }
              `}</style>
            </div>
          </View>
          <TextField
            flex
            isQuiet
            isReadOnly
            aria-label="nomor transaksi"
            width="auto"
            label="Nomor Transaksi"
            placeholder={'e.g. JRU-'}
            defaultValue={data.proof || ''}
          />
          <TextField
            flex
            isQuiet
            width="auto"
            aria-label="tags"
            label="Tags"
            placeholder={'e.g penerimaan'}
            value={data.tags || ''}
            onChange={(e) => onChange('tags', e)}
          />
        </Flex>

        <View>
          <Rows journalId={data.id} SaveJournal={saveJournal} memo={data.memo} />
        </View>
      </View>
    </View>
  )
}

function Rows({
  journalId,
  SaveJournal,
  memo: oldMemo,
}: {
  memo: string | undefined
  SaveJournal: (
    journalId: number,
    details: AsyncListData<iJournalDetail>,
    memo: string | undefined,
    deletes: number[]
  ) => void
  journalId: number
}) {
  const [showChild, setShowChild] = React.useState(false)
  const { journal, coa, source } = React.useContext<JournalContextParam>(JournalContext)
  let [ids, setIds] = React.useState<number[]>([])
  let [total, setTotal] = React.useState({
    debt: 0,
    cred: 0,
    enableButton: false,
  })
  let [message, setMessage] = React.useState('')
  let [newMemo, setNewMemo] = React.useState<string | undefined>()
  let [allowFocus, setAllowFocus] = React.useState(false)

  let details = useAsyncList<iJournalDetail>({
    async load({ signal }) {
      let res = await fetch(`/api/journal-detail/get-by-journal/${source.getSelected}`, { signal })
      let json: iJournalDetail[] | any = await res.json()
      return { items: res.status === 200 ? json : [initJournalDetail] }
    },
    getKey: (item: iJournalDetail) => item.id,
  })

  React.useEffect(() => {
    let isLoaded = false

    if (!isLoaded) {
      setNewMemo(oldMemo)
    }

    return () => {
      isLoaded = true
    }
  }, [oldMemo])

  React.useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild) {
    // You can show some kind of placeholder UI here
    return null
  }

  if (details.isLoading) {
    return (
      <Flex marginTop="size-500" alignItems="center" alignSelf="center" justifyContent="center">
        <ProgressCircle aria-label="Loading…" isIndeterminate />
      </Flex>
    )
  }

  return (
    <View>
      <View
        borderColor="gray-400"
        backgroundColor="gray-75"
        borderWidth="thin"
        marginTop="size-300"
        marginBottom="size-100"
        borderRadius="medium"
      >
        <View
          marginTop="size-100"
          paddingX={{
            base: 'size-100',
            M: 'size-200',
            L: 'size-200',
          }}
        >
          {details.items.map((item, i) => (
            <Flex
              wrap
              flex
              key={item.id}
              marginY="size-100"
              direction={{ base: 'column', M: 'row', L: 'row' }}
              gap="size-100"
            >
              <ComboBox
                isQuiet
                autoFocus={allowFocus}
                flex
                placeholder={'e.g. Pilih salah satu akun'}
                aria-label="Pilih salah satu akun"
                defaultSelectedKey={item.coaId}
                defaultItems={coa.items.filter(
                  (o) => o.postable === postableCoa.POSTABLE && o.id > 0
                )}
                // val={item.coaId}
                // @ts-ignore
                onSelectionChange={(e) => {
                  if (
                    details.items.filter((x) => x.coaId !== item.id && x.coaId === +e).length > 0
                  ) {
                    setMessage('Tidak boleh ada akun yg sama dalam satu transaksi.')
                    item.coaId = 0
                  } else {
                    setMessage('')
                    item.coaId = +e
                    item.isChanged = true
                  }
                }}
              >
                {(itam) => <Item>{`${itam.code.toString().padStart(4, '0')} - ${itam.name}`}</Item>}
              </ComboBox>

              <TextField
                isQuiet
                flex
                aria-label={'Keterangan'}
                placeholder="e.g. keterangan"
                maxWidth={'size-3400'}
                defaultValue={item.description || ''}
                onChange={(e) => {
                  item.description = e
                  item.isChanged = true
                }}
              />
              <NumberField
                isQuiet
                maxWidth="120px"
                aria-label="debt"
                hideStepper
                defaultValue={item.debt}
                onChange={(e) => {
                  item.debt = +e
                  const test = details.items.filter((x) => x.debt - x.cred === 0)
                  item.isChanged = true
                  setTotal((prev) => ({
                    ...prev,
                    enableButton: test.length === 0,
                    debt: details.items.reduce((res, p) => res + p.debt, 0),
                  }))
                }}
              />
              <NumberField
                isQuiet
                maxWidth="120px"
                aria-label="cred"
                hideStepper
                defaultValue={item.cred}
                onChange={(e) => {
                  item.cred = +e
                  const test = details.items.filter((x) => x.debt - x.cred === 0)
                  item.isChanged = true
                  setTotal((prev) => ({
                    ...prev,
                    enableButton: test.length === 0,
                    cred: details.items.reduce((res, p) => res + p.cred, 0),
                  }))
                }}
              />
              <ActionButton
                isQuiet
                onPress={(e) => {
                  //item.isDeleted = true;
                  //   setTotal((prev) => ({
                  //   enableButton:
                  //     details.items.filter(
                  //       (x) => x.debt - x.cred === 0 && x.id != item.id
                  //     ).length === 0,
                  //   debt: details.items
                  //     .filter((x) => x.id != item.id)
                  //     .reduce((res, p) => res + p.debt, 0),
                  //   cred: details.items
                  //     .filter((x) => x.id != item.id)
                  //     .reduce((res, p) => res + p.cred, 0),
                  // }));
                  if (!item.isNew) {
                    setIds((p) => [...p, item.id])
                  }
                  details.remove(item.id)
                }}
              >
                <RemoveFRom size="S" />
              </ActionButton>
            </Flex>
          ))}
        </View>

        <View
          backgroundColor="gray-100"
          paddingY="size-100"
          paddingX="size-300"
          marginTop="size-300"
          borderBottomEndRadius="medium"
          borderBottomStartRadius="medium"
        >
          <Button
            variant={'primary'}
            onPress={() => {
              setAllowFocus(true)
              setTotal((prev) => ({ ...prev, enableButton: false }))
              if (details) {
                const newId = details.items.length + 1
                details.append({
                  ...initJournalDetail,
                  isNew: true,
                  id: newId,
                })
                details.selectedKeys = new Set([newId])
              }
            }}
          >
            <AddTo size="S" aria-label="Tambah item" />
            <Text>Tambah Item</Text>
          </Button>
        </View>
      </View>

      <View padding={message === '' ? '0' : 'size-300'}>
        <span>{message}</span>
        <style jsx>{`
          span {
            color: red;
          }
        `}</style>
      </View>

      <Flex
        marginTop={{ base: 'size-100', M: 'size-500', L: 'size-500' }}
        direction={{ base: 'column', L: 'row', M: 'row' }}
        gap="size-200"
      >
        <View flex>
          <TextArea
            isQuiet
            maxWidth={'size-3600'}
            minHeight="100px"
            minWidth="320px"
            label="Memo"
            aria-label="memo"
            value={newMemo || ''}
            onChange={(e) => setNewMemo(e)}
          />
        </View>
        <NumberField
          isQuiet
          hideStepper
          label="Total debit"
          isReadOnly
          value={details.items.reduce((s, f) => s + f.debt, 0)}
        />
        <NumberField
          isQuiet
          hideStepper
          isReadOnly
          label="Total credit"
          value={details.items.reduce((s, f) => s + f.cred, 0)}
        />
      </Flex>

      <Flex direction="row" marginTop="size-200">
        <View flex>
          <Button
            variant={'secondary'}
            onPress={() => source.gotoPage('journal')}
            //isDisabled={journalId === 0}
            minWidth={{ M: 'size-1200', L: 'size-1200' }}
          >
            Batal
          </Button>
          <Button
            minWidth={{ M: 'size-1200', L: 'size-1200' }}
            marginStart="size-100"
            onPress={(e) => {
              if (
                details.items.reduce((a, b) => a + b.debt, 0) !==
                details.items.reduce((a, b) => a + b.cred, 0)
              ) {
                setMessage('Total Debit dan Credit harus sama!')
                return
              } else if (details.items.filter((x) => x.cred === x.debt).length > 0) {
                setMessage('Item Debit dan Credit tidak boleh sama!')
                return
              } else if (details.items.filter((x) => x.cred !== 0 && x.debt !== 0).length > 0) {
                setMessage('Salah satu item Debit dan Credit harus NOL!')
                return
              } else if (details.items.filter((x) => x.coaId === 0).length > 0) {
                setMessage('Akun tidak boleh kosong atau sama!')
              } else {
                setMessage('')
                SaveJournal(journalId, details, newMemo, ids)
              }
            }}
            variant="cta"
          >
            Simpan
          </Button>
        </View>
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
            isDisabled={journalId === 0}
          >
            Hapus
          </Button>
        </ButtonGroup>
      </Flex>
    </View>
  )
}
