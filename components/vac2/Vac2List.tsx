import dynamic from 'next/dynamic'
import React, { Key, useState } from 'react'
import { useAsyncList } from '@react-stately/data'
import {
  Button,
  Checkbox,
  View,
  Flex,
  ProgressCircle,
  ToggleButton,
  Divider,
} from '@adobe/react-spectrum'
import { SearchField } from '@react-spectrum/searchfield'
import DownloadIcon from '@spectrum-icons/workflow/Download'
import Pin from '@spectrum-icons/workflow/PinOff'
import { iCovid, iVaccin } from '@components/interfaces'
import { initCovid } from './Vac2Form'
import { FormatDate } from '@lib/format'
import moment from 'moment'
import SubList from './SubList'
import { fontSize } from 'pdfkit'

const colWidth = 1000

const initVaccin = {
  vac2Id: 0,
  id: 0,
  createdAt: moment(new Date()).format('YYYY-MM-DD HH:MM:ss'),
  vacType: '',
  batch: '',
  vacLocation: '',
  description: '',
  isNew: true,
  isChanged: false,
}

const cols = [
  { id: 1, name: 'Tiket', uid: 'ticket', width: (colWidth * 12.5) / 100 },
  { id: 2, name: 'NIK', uid: 'nik', width: (colWidth * 15.5) / 100 },
  { id: 3, name: 'Name', uid: 'name', width: (colWidth * 25.7) / 100 },
  {
    id: 4,
    name: 'Tgl. Lahir',
    uid: 'birthDate',
    width: (colWidth * 11.0) / 100,
  },
  // { id: 5, name: 'Phone', uid: 'phone', width: (colWidth * 13.5) / 100 },
]

const Vac2Form = dynamic(() => import('./Vac2Form'))

export default function Vac2List() {
  //let [selectedKeys, setSelectedKeys] = React.useState(new Set<string>([]))
  let [isDownloading, setIsDownloading] = React.useState(false)
  const [txtSearch, setTxtSearch] = React.useState<string | null>(null)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  let [data, setData] = useState<iCovid>({} as iCovid)
  const [open, setOpen] = React.useState(false)
  let listData = useAsyncList<iCovid>({
    async load({ signal }) {
      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }

      let response = await fetch(`/api/vac2`, { signal })
      let json: iCovid[] = await response.json()

      //console.log(json)
      return {
        items: response.status === 200 ? [initCovid, ...json] : [initCovid],
      }
    },
    getKey: (item: iCovid) => item.id,
  })

  const downloadCard = async () => {
    const selData = listData.items.filter((x) => x.isSelected).map((x) => x.id)

    setTimeout(() => setIsDownloading(true), 100)

    const url = `/api/pdf/covid-19`
    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify({ data: selData }),
    }

    //console.log(peoples);

    const res = await fetch(url, fetchOptions)
    const data = await res.blob()

    if (res.status !== 200) {
      setTimeout(() => setIsDownloading(false), 100)
      return []
    }

    var fileURL = URL.createObjectURL(data)
    const file = 'covid-card.pdf'
    var a = document.createElement('a')
    document.body.appendChild(a)
    a.style.display = 'none'
    a.href = fileURL
    a.download = file
    a.click()
    setTimeout(() => window.URL.revokeObjectURL(fileURL), 100)
    a.remove()
    setTimeout(() => setIsDownloading(false), 100)
  }

  const updateData = async (method: string, item: iCovid, id: number) => {
    const url = `/api/vac2/${id}`
    const fetchOptions = {
      method: method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ data: item }),
    }

    const res = await fetch(url, fetchOptions)
    const data: iCovid | any = await res.json()

    if (res.status === 200) {
      setOpen(false)
      if (id > 0) {
        listData.update(id, data)
      } else {
        listData.insertAfter(0, { ...data })
        //console.log('test')
        //listData.reload()
      }
    }
  }

  const handleSubmit = (method: string, e: iCovid) => {
    //console.log(e)
    if (method === 'delete') {
      handleDelete(e.id)
    } else {
      updateData(method, e, e.id)
    }
  }

  const handleDelete = async (id?: number) => {
    const url = `/api/vac2/${id}`
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }

    const response = await fetch(url, fetchOptions)
    const result: iCovid | any = await response.json()

    if (response.status === 200) {
      setOpen(false)
      listData.remove(data.id)
    } else {
      console.log('Data tidak bisa dihapus!')
    }
  }

  if (listData.isLoading) {
    return (
      <Flex alignItems="center" alignSelf="center" justifyContent="center" marginY={'size-400'}>
        <ProgressCircle aria-label="Loading…" isIndeterminate />
      </Flex>
    )
  }

  const searchPeople = async () => {
    const url = `/api/vac2/search/${txtSearch?.toLocaleLowerCase()}`
    const fetchOptions = {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }

    const res = await fetch(url, fetchOptions)
    const json = await res.json()

    if (res.ok && res.status === 200) {
      listData.setSelectedKeys('all')
      listData.removeSelectedItems()
      listData.append(...json)
    }
  }

  return (
    <>
      <Flex flex alignItems="center" alignContent="center" direction="column">
        <SearchField
          alignSelf="center"
          justifySelf="center"
          aria-label="Search people name"
          placeholder="e.g. taringkem"
          width="auto"
          maxWidth="size-3600"
          value={txtSearch || ''}
          onClear={() => {
            setIsSearching(false)
            listData.reload()
          }}
          onChange={(e) => setTxtSearch(e)}
          onSubmit={() => {
            setIsSearching(true)
            searchPeople()
          }}
        />
      </Flex>

      <View marginX={{ base: 'size-50', M: 'size-1000', L: 'size-2000' }} marginY="size-400">
        <Flex direction="row" marginY="size-200" marginX="size-50">
          <View flex>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>Data List</span>
          </View>
          <View>
            <Button variant="cta" onPress={() => downloadCard()}>
              <DownloadIcon size="S" />
              <View marginStart="size-100">Download</View>
            </Button>
          </View>
        </Flex>
        <Divider size="S" />

        <View marginTop="size-400">
          {listData.items.map((item, index) => (
            <View key={item.id} aria-label="people-list">
              {data.id === item.id && open ? (
                <Vac2Form key={item.id} submitData={handleSubmit} setOpen={setOpen} data={item} />
              ) : (
                <ShowPeople
                  editedPeople={item}
                  setOpen={setOpen}
                  index={index}
                  setEditedPeople={setData}
                />
              )}
            </View>
          ))}
          <View marginY="size-400">
            <Button variant="cta" onPress={() => downloadCard()}>
              <DownloadIcon size="S" />
              <View marginStart="size-100">Download</View>
            </Button>
          </View>
        </View>
      </View>
    </>
  )
}

function SelectPeople({ item }: { item: iCovid }) {
  const [isSelected, setIsSelected] = useState(false)
  React.useEffect(() => {
    let isLoaded = false

    if (!isLoaded) {
      setIsSelected(item.isSelected || false)
    }

    return () => {
      isLoaded = true
    }
  }, [item.isSelected])

  return (
    <Checkbox
      aria-label="check people"
      marginTop={{ base: '-6px', M: '-4px' }}
      key={`check-${item.id}`}
      defaultSelected={isSelected}
      onChange={(e) => {
        setIsSelected(e)
        item.isSelected = e
      }}
    />
  )
}

type ShowPeopleParam = {
  editedPeople: iCovid
  index: number
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setEditedPeople: React.Dispatch<React.SetStateAction<iCovid>>
}

function ShowPeople({ editedPeople, index, setOpen, setEditedPeople }: ShowPeopleParam) {
  let [showSubList, setShowSubList] = useState(false)
  let [data, setData] = useState<iCovid>({} as iCovid)

  React.useEffect(() => {
    let isLoaded = false

    if (!isLoaded) {
      setData(editedPeople)
    }

    return () => {
      isLoaded = true
    }
  }, [editedPeople])

  return (
    <View backgroundColor={index % 2 === 1 ? 'gray-100' : 'transparent'} borderRadius={'medium'}>
      <View padding="size-100">
        <Flex
          marginY="size-200"
          marginX="size-50"
          direction={{ base: 'column', M: 'row' }}
          gap="size-100"
        >
          <View width={{ base: '100%', M: '35%' }} aria-label="people details">
            {data.id > 0 ? (
              <>
                <SelectPeople item={data} />
                <span
                  style={{ fontSize: 'medium', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => {
                    setEditedPeople(data)
                    setOpen(true)
                  }}
                >
                  {data.name}
                </span>
                <TogglePeople showFucksin={showSubList} setShowFucksin={setShowSubList} />
              </>
            ) : (
              <span
                style={{ fontSize: 'medium', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => {
                  setEditedPeople(data)
                  setOpen(true)
                }}
              >
                {data.id === 0 ? 'New name' : data.name}
              </span>
            )}
          </View>
          {data.id > 0 && (
            <View flex>
              <Flex direction={{ base: 'column', M: 'row' }}>
                <View flex>
                  <Flex direction="row">
                    <View width={{ base: '35%', M: '40%' }}>Date</View>
                    <View flex>{data.id > 0 && FormatDate(data.birthDate)}</View>
                  </Flex>
                  <Flex direction="row">
                    <View width={{ base: '35%', M: '40%' }}>NIK</View>
                    <View flex>{data.nik}</View>
                  </Flex>
                </View>
                <View flex>
                  <Flex direction="row">
                    <View width={{ base: '35%', M: '40%' }}>Ticket</View>
                    <View flex>{data.ticket}</View>
                  </Flex>
                  <Flex direction="row">
                    <View width={{ base: '35%', M: '40%' }}>Phone</View>
                    <View flex>{data.phone}</View>
                  </Flex>
                  <Flex direction="row">
                    <View width={{ base: '35%', M: '40%' }}>Address</View>
                    <View flex>
                      <View>{data.address}</View>
                    </View>
                  </Flex>
                </View>
              </Flex>
            </View>
          )}
        </Flex>
      </View>
      {showSubList && <SubList vac2Id={data.id} />}
    </View>
  )
}

function TogglePeople({
  showFucksin,
  setShowFucksin,
}: {
  showFucksin: boolean
  setShowFucksin: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <View flex marginTop="size-200">
      <ToggleButton flex isEmphasized isSelected={showFucksin} onChange={setShowFucksin}>
        <Pin aria-label="Pin" />
      </ToggleButton>
    </View>
  )
}
