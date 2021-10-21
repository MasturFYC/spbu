import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { useAsyncList } from '@react-stately/data'
import { iCovid, iVaccin } from '@components/interfaces'
import moment from 'moment'
import { Divider, Flex, ProgressCircle, View } from '@adobe/react-spectrum'
import { initialVaccin } from './SubForm'

//const colWidth = 1000

const initVaccin = {
  vac2Id: 0,
  id: 0,
  createdAt: moment(new Date()).format('YYYY-MM-DD HH:MM:ss'),
  vacType: 'CoronaVac',
  batch: '',
  vacLocation: '',
  description: '',
  isNew: true,
  isChanged: false,
}

const SubForm = dynamic(() => import('./SubForm'))

export default function SubList({ vac2Id }: { vac2Id: number }) {
  let [data, setData] = useState<iVaccin>(initialVaccin)
  const [open, setOpen] = React.useState(false)

  let list = useAsyncList<iVaccin>({
    async load({ signal }) {
      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }

      let response = await fetch(`/api/vac2-sub/${vac2Id}`, { signal })
      let json: iVaccin[] = await response.json()

      //console.log(json)
      return {
        items:
          response.status === 200 && json.length > 0
            ? [
                {
                  ...initVaccin,
                  vac2Id: vac2Id,
                },
                ...json,
              ]
            : [{ ...initVaccin, vac2Id: vac2Id }],
      }
    },
    getKey: (item: iVaccin) => item.id,
  })

  const updateData = async (method: string, item: iVaccin, id: number) => {
    const url = `/api/vac2-sub/${id}`

    const newId = list.items.length > 0 ? list.items[list.items.length - 1].id + 1 : 1

    //console.log(newId)

    const fetchOptions = {
      method: method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        data: { ...item, id: newId },
      }),
    }

    const res = await fetch(url, fetchOptions)
    const data: iVaccin | any = await res.json()

    if (res.status === 200) {
      //console.log(data)
      if (item.isNew) {
        list.append({
          ...data,
          isNew: false,
          isChanged: false,
        })
      } else {
        list.update(id, { ...data, isChanged: false })
      }
      setOpen(false)
    }
  }

  const handleSubmit = (method: string, e: iVaccin) => {
    //console.log(e)
    if (method === 'delete') {
      handleDelete(e)
    } else {
      updateData(method, e, e.id)
    }
  }

  const handleDelete = async (e: iVaccin) => {
    const url = `/api/vac2-sub/${e.id}/?vac2Id=${e.vac2Id}`
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
      list.remove(data.id)
    } else {
      console.log('Data tidak bisa dihapus!')
    }
  }
  if (list.isLoading) {
    return (
      <View>
        <ProgressCircle aria-label="Loading…" isIndeterminate />
      </View>
    )
  }

  return (
    <View
      backgroundColor="gray-200"
      padding="size-100"
      borderRadius="regular"
      borderColor="transparent"
      marginY="size-400"
    >
      {list.items.map((item, index) => (
        <View key={`${item.id}-${vac2Id}-${index}`} marginY="size-200">
          {data.id === item.id && open ? (
            <SubForm submitData={handleSubmit} setOpen={setOpen} item={item} />
          ) : (
            <View key={`$-${vac2Id}-${item.id}`}>
              <View>
                <span
                  style={{ cursor: 'pointer', display: 'inline-block', fontWeight: 700 }}
                  onClick={() => {
                    //console.log(item)
                    setData(item)
                    setOpen(true)
                  }}
                >
                  {item.isNew ? 'New Fucksin' : item.vacType}
                </span>
              </View>
              {!item.isNew && (
                <View>
                  <Flex direction="row">
                    <View width={{ base: '35%', M: '40%' }}>Batch</View>
                    <View>{item.batch}</View>
                  </Flex>
                  <Flex direction="row">
                    <View width={{ base: '35%', M: '40%' }}>On Date</View>
                    <View flex>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</View>
                  </Flex>
                  <Flex direction="row">
                    <View width={{ base: '35%', M: '40%' }}>Location</View>
                    <View flex>{item.vacLocation}</View>
                  </Flex>
                  <Flex direction="row">
                    <View width={{ base: '35%', M: '40%' }}>Description</View>
                    <View flex>{item.description}</View>
                  </Flex>
                </View>
              )}
            </View>
          )}
        </View>
      ))}
    </View>
  )
}
