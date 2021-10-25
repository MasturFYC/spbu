import dynamic from 'next/dynamic'
import React, { Key, useState } from 'react'
import {
  Button,
  Checkbox,
  DialogContainer,
  Divider,
  Flex,
  ProgressCircle,
  SearchField,
  View,
} from '@adobe/react-spectrum'
import { iUserLogin, iVac1 } from '../interfaces'
import { FormatDate } from '../../lib/format'
import { useAsyncList } from '@react-stately/data'
import { initData } from './Vac1Form'
import DownloadIcon from '@spectrum-icons/workflow/Download'
import { list } from 'postcss'
//const title: string = 'Fucksin Card Model 1'

const Vac1Form = dynamic(() => import('./Vac1Form'))

const Vac1List = ({ user }: { user?: iUserLogin }) => {
  const [data, setData] = React.useState<iVac1>(initData)
  const [isOpen, setIsOpen] = React.useState(false)
  const [txtSearch, setTxtSearch] = React.useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSearching, setIsSearching] = useState<boolean>(false)

  let listData = useAsyncList<iVac1>({
    async load({ signal }) {
      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }

      let response = await fetch(`/api/vac1`, { signal })
      let json: iVac1[] = await response.json()

      //console.log(json)
      return {
        items: response.status === 200 ? [initData, ...json] : [initData],
      }
    },
    getKey: (item: iVac1) => item.id,
  })

  const updateData = async (method: string, item: iVac1, id: number) => {
    const url = `/api/vac1/${id}`
    const fetchOptions = {
      method: method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ data: item }),
    }

    const res = await fetch(url, fetchOptions)
    const data: iVac1 | any = await res.json()

    if (res.status === 200) {
      setIsOpen(false)
      if (id > 0) {
        listData.update(id, data)
      } else {
        listData.insertAfter(0, { ...data })
        //console.log('test')
        //listData.reload()
      }
    }
  }

  const handleSubmit = (method: string, e: iVac1) => {
    //console.log(e)
    if (method === 'delete') {
      handleDelete(e.id)
    } else {
      updateData(method, e, e.id)
    }
  }

  const handleDelete = async (id?: number) => {
    const url = `/api/vac1/${id}`
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }

    const response = await fetch(url, fetchOptions)
    const result: iVac1 | any = await response.json()

    if (response.status === 200) {
      setIsOpen(false)
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
    const url = `/api/vac1/search/${txtSearch?.toLocaleLowerCase()}`
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
      <DialogContainer type={'modal'} onDismiss={() => setIsOpen(false)} isDismissable>
        {isOpen && (<Vac1Form submitData={handleSubmit} data={data} />) }
      </DialogContainer>

      <Flex flex alignItems="center" alignContent="center" direction="column">
        <SearchField
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
        <Flex flex direction="row" marginBottom="size-200" marginX="size-50">
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
            <PeopleList key={item.id} item={item} setOpen={setIsOpen} open={isOpen} index={index} setData={setData} />
          ))}
          <Divider size="S" />
          <View marginY="size-400" marginX="size-50">
            <Button variant="cta" onPress={() => downloadCard()}>
              <DownloadIcon size="S" />
              <View marginStart="size-100">Download</View>
            </Button>
          </View>
        </View>
      </View>
    </>
  )

  async function downloadCard() {
    setTimeout(() => setIsDownloading(true), 100)
    let sel: iVac1[] = listData.items.filter((x) => x.isSelected && x.id > 0)
    //console.log(sel)

    if (sel.length > 0) {
      const url = `/api/pdf/vac1`
      const fetchOptions = {
        method: 'POST',
        body: JSON.stringify({ data: sel }),
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
  }
}

type listParam = {
  item: iVac1
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  open: boolean
  setData: React.Dispatch<React.SetStateAction<iVac1>>
  index: number
}

export default Vac1List

function PeopleList({ item, setOpen, open, setData, index }: listParam): JSX.Element {
  const [isSelected, setIsSelected] = useState(false)

  React.useEffect(() => {
    let isLoaded = false

    if (!isLoaded) {
      setIsSelected(item.isSelected)
    }

    return () => {
      isLoaded = true
    }
  }, [item.isSelected])

  const handleSelData = (e: boolean) => {
    setIsSelected(e)
    item.isSelected = e
  }

  const renderVaccin = (item: iVac1) => (
    <View flex>
      <Flex direction={{ base: 'column', M: 'row' }} gap="size-100">
        <View width={{ base: '100%', M: '50%', L: '50%' }}>
          <View marginBottom="size-100">
            <span style={{ fontWeight: 700 }}>First Fucksin</span>
          </View>
          <Flex direction="row">
            <View width={{ base: '35%', M: '40%' }}>Date</View>
            <View flex>{item.id > 0 && FormatDate(item.firstDate)}</View>
          </Flex>
          <Flex direction="row">
            <View width={{ base: '35%', M: '40%' }}>Fucksin Type</View>
            <View flex>{item.id > 0 && item.vacType}</View>
          </Flex>
          <Flex direction="row">
            <View width={{ base: '35%', M: '40%' }}>Batch</View>
            <View flex>{item.firstBatch}</View>
          </Flex>
          <Flex direction="row">
            <View width={{ base: '35%', M: '40%' }}>QR Code</View>
            <View flex>{item.firstQr}</View>
          </Flex>
        </View>
        <View width={{ base: '100%', M: '50%', L: '50%' }}>
          <View marginBottom="size-100">
            <span style={{ fontWeight: 700 }}>Second Fucksin</span>
          </View>
          <Flex direction="row">
            <View width={{ base: '35%', M: '40%' }}>Date</View>
            <View flex>{item.id > 0 && FormatDate(item.nextDate)}</View>
          </Flex>
          <Flex direction="row">
            <View width={{ base: '35%', M: '40%' }}>Fucksin Type</View>
            <View flex>{item.id > 0 && item.vacType}</View>
          </Flex>
          <Flex direction="row">
            <View width={{ base: '35%', M: '40%' }}>Batch</View>
            <View flex>{item.nextBatch}</View>
          </Flex>
          <Flex direction="row">
            <View width={{ base: '35%', M: '40%' }}>QR Code</View>
            <View flex>{item.nextQr}</View>
          </Flex>
        </View>
      </Flex>
    </View>
  )

  const renderPeople = (item: iVac1) => (
    <View flex marginTop="size-100">
      <Flex direction="row">
        <View width={{ base: '35%', M: '40%' }}>UUID</View>
        <View flex>{item.uuid}</View>
      </Flex>
      <Flex direction="row">
        <View width={{ base: '35%', M: '40%' }}>NIK</View>
        <View flex>{item.nik}</View>
      </Flex>
      <Flex direction="row">
        <View width={{ base: '35%', M: '40%' }}>Birth Date</View>
        <View flex>{item.id > 0 && FormatDate(item.birthDate)}</View>
      </Flex>
    </View>
  )

  return (
    <View
      padding="size-100"
      backgroundColor={index % 2 === 1 ? 'gray-100' : 'transparent'}
      borderRadius={'medium'}
    >
      <Flex
        marginY="size-400"
        marginX="size-50"
        direction={{ base: 'column', M: 'row' }}
        gap="size-100"
      >
        <View width={{ base: '100%', M: '40%' }}>
          <Flex direction="row">
            {item.id > 0 && (
              <Checkbox
                marginTop={{ base: '-6px', M: '-2px' }}
                aria-label="Select to print"
                defaultSelected={isSelected}
                onChange={(e) => handleSelData(e)}
              />
            )}
            <View flex>
              <span
                onClick={() => {
                  setData(item)
                  setOpen(true)
                }}
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {item.id === 0 ? 'New name' : item.name || 'Unknown'}
              </span>
            </View>
          </Flex>

          {item.id > 0 && renderPeople(item)}
        </View>
        {item.id > 0 && renderVaccin(item)}
      </Flex>
      {/* <Divider size="S" /> */}
    </View>
  )
}
