import Head from 'next/head'
import dynamic from 'next/dynamic'
import React from 'react'

import { Flex, ProgressCircle, View } from '@adobe/react-spectrum'

import Layout, { siteTitle } from '@components/layout'
import useUser from '../../lib/use-user'
import { iJournal } from '../interfaces'
import { comparer, useJournal } from '../../lib/use-journal'
import { useRouter } from 'next/router'
import JournalMenu from './menu'
import { useCOA } from '@lib/use-coa'
import { JournalProvider } from '../../lib/journal-provider'
import WaitMe from '@components/ui/wait-me'

const OrderForm = dynamic(() => import('./orders'))
const JournalSpbuForm = dynamic(() => import('./spbu'))
const JournalForm = dynamic(() => import('./form'))
const JournalList = dynamic(() => import('./list'))

export default function JournalComponent() {
  const router = useRouter()
  const { s: startDate, e: endDate } = router.query
  const { user, mutateUser } = useUser()
  const [tabId, setTabId] = React.useState<string>('journal')
  const [journalId, setJournalId] = React.useState<number>(0)
  const [isSearching, setIsSearching] = React.useState<boolean>(false)

  let listCoa = useCOA()
  let listJournal = useJournal(startDate, endDate)

  const onSelectionChange = (e: React.Key) => {
    setJournalId(0)
    setTabId(e.toString())
  }

  const editJournal = () => {
    setTabId('transaksi')
  }

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
      listJournal.remove(id)
      setJournalId(0)
      listJournal.setSelectedKeys(new Set(['0']))
    } else {
      callback(undefined)
    }
  }

  const searchJournal = async (txt: string, isCleared: boolean) => {
    setIsSearching(true)

    if (isCleared) {
      listJournal.reload()
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
          listJournal.setSelectedKeys('all')
          listJournal.removeSelectedItems()
          listJournal.append(...data.sort(comparer))
          listJournal.selectedKeys = data[0].id
        }
      }
    }

    setTimeout(() => {
      setIsSearching(false)
    }, 100)
  }

  return (
    <Layout user={user} mutateUser={mutateUser} activeMenu="journal">
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className="w-full flex flex-col md:flex-row lg-flex-row bg-gray-200 h-full">
        <div className="w-full flex bg-gray-50 md:w-1/4 lg:w-1/4 p-4 md:p-8 lg:p-16 border-r border-r-transparent md:border-r-1 md:border-gray-400 md:border-r-1 lg:border-r-1 lg:border-gray-400">
          <JournalMenu selectedMenu={tabId} onSelectionChange={onSelectionChange} user={user} />
        </div>

        <div className="my-8 w-full md:max-w-screen-md p-2 mx-auto">
          {listCoa.isLoading ? (
            <WaitMe />
          ) : (
            <JournalProvider
              value={{
                coa: listCoa,
                journal: listJournal,
                source: {
                  searchJournal: searchJournal,
                  isJournalSaved: false,
                  setSelected: setJournalId,
                  getSelected: journalId,
                  update: updateJournal,
                  insert: insertJournal,
                  remove: deleteJournal,
                  gotoPage: (page: string) => {
                    setTabId(page)
                  },
                },
              }}
            >
              {tabId === 'journal' &&
                (isSearching || listJournal.isLoading ? <WaitMe /> : <JournalList user={user} />)}
              {tabId === 'transaksi' && <JournalForm user={user} />}
              {tabId === 'order' && <OrderForm user={user} />}
              {tabId === 'spbu' && <JournalSpbuForm user={user} />}
            </JournalProvider>
          )}
        </div>
      </div>
    </Layout>
  )
}
