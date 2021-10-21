import Head from 'next/head'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'

import { Flex, ProgressCircle, View } from '@adobe/react-spectrum'

import Layout, { siteTitle } from '@components/layout'
import useUser from '@lib/use-user'
import { iJournal } from '@components/interfaces'
import { comparer } from '@lib/use-journal'
import { useCOA } from '@lib/use-coa'
import WaitMe from '@components/ui/wait-me'
import { useStockList } from '@lib/use-stock-list'
import { useLinkedCoa } from '@lib/useCoaSetup'
import useStock from '@lib/use-stock'
import { route } from 'next/dist/server/router'

const StockRows = dynamic(() => import('./stock-rows'))
const StockForm = dynamic(() => import('./form'))
interface paramDates {
  s: string | string[] | undefined
  e: string | string[] | undefined
}
const linkCode = 'ORD'
const tabId = 'stock'

export default function StockComponent() {
  const router = useRouter()
  const { user, mutateUser } = useUser()
  const setupCoas = useLinkedCoa(linkCode)
  const [journalId, setJournalId] = React.useState<number>(0)
  const [isSearching, setIsSearching] = React.useState<boolean>(false)
  const [searchDate, setSearchDate] = useState<paramDates>({ s: router.query.s, e: router.query.e })

  const listCoa = useCOA()
  const listStock = useStockList(searchDate.s, searchDate.e)
  const {
    isLoading: stockLoading,
    stock,
    error: errStock,
    mutate: mutateStock,
  } = useStock(router.query.id)

  const updateJournal = async (
    id: number,
    j: iJournal,
    callback: (res: iJournal | undefined) => void
  ) => {
    const url = `/api/journal/${id}`

    const fetchOptions = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(j),
    }

    const res = await fetch(url, fetchOptions)
    const data: iJournal | any = await res.json()

    if (res.status === 200) {
      callback(data)
    } else {
      callback(undefined)
    }
  }

  const insertJournal = async (j: iJournal, callback: (data: iJournal | undefined) => void) => {
    const url = `/api/journal/0`
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(j),
    }

    const res = await fetch(url, fetchOptions)
    const data: iJournal | any = await res.json()

    if (res.status === 200) {
      //mutateJournal(journals, true);
      callback(data)
    } else {
      callback(undefined)
    }
  }

  const deleteJournal = async (id: number, callback: (data: iJournal | undefined) => void) => {
    const url = `/api/journal/${id}`
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }

    const res = await fetch(url, fetchOptions)
    const data: iJournal | any = await res.json()

    if (res.status === 200) {
      callback(data)
      listStock.remove(id)
      setJournalId(0)
      listStock.setSelectedKeys(new Set(['0']))
    } else {
      callback(undefined)
    }
  }

  const searchJournal = async (txt: string, isCleared: boolean) => {
    setIsSearching(true)

    if (isCleared) {
      listStock.reload()
    } else {
      const url = `/api/journal/search/${txt}`
      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }
      const res = await fetch(url, fetchOptions)
      const data: iJournal[] | any = await res.json()

      if (res.status === 200) {
        if (data.length > 0) {
          listStock.setSelectedKeys('all')
          listStock.removeSelectedItems()
          listStock.append(...data.sort(comparer))
          listStock.selectedKeys = data[0].id
        }
      }
    }

    setTimeout(() => {
      setIsSearching(false)
    }, 100)
  }

  return (
    <Layout user={user} mutateUser={mutateUser} activeMenu={tabId}>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <div className="w-full flex flex-col md:flex-row lg-flex-row">
        {listCoa.isLoading ? (
          <WaitMe />
        ) : (
          <>
            <div className="w-full md:w-1/4 lg:w-1/4 my-8 p-2">
              {listStock.isLoading ? <WaitMe /> : <StockRows stock={listStock} />}
            </div>
            <div className="flex flex-1 my-8 p-2">
              {stockLoading ? <WaitMe /> : <StockForm stock={stock} user={user} />}
            </div>
            <div className="w-full md:w-1/4 lg:w-1/4 my-8 p-2"> -- </div>
          </>
        )}
      </div>
    </Layout>
  )
}
