import React from 'react'
import Head from 'next/head'
import {
  Flex,
  Text,
  ProgressCircle,
  SearchField,
} from '@adobe/react-spectrum'
import SearchIcon from '@spectrum-icons/workflow/Search'
import Layout, { siteTitle } from '../layout'
import useUser from '../../lib/use-user'
import CoaList from './list'
import { iCoa } from '../interfaces'
import { initCoa, useCOA } from '../../lib/use-coa'
import { useCoaParent } from '@lib/use-coa-parent'

export default function CoaComponent() {
  const [isSearching, setIsSearching] = React.useState<boolean>(false)
  const { user, mutateUser } = useUser()
  const [crumbId, setCrumbId] = React.useState<number>(1)

  const coas = useCOA()
  const coaParent = useCoaParent()

  const searchCoa = async (e: string) => {
    setIsSearching(true)
    const url = `/api/coa/search/${e}`
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }
    const res = await fetch(url, fetchOptions)
    const data: iCoa[] | any = await res.json()
    //console.log(data);

    if (res.status === 200) {
      //console.log(data);
      coas.setSelectedKeys('all')
      coas.removeSelectedItems()
      coas.append(...[initCoa, ...data])
      if (data.length > 0) {
        const c: iCoa = data[0]
        coas.setSelectedKeys(new Set(['' + c.id]))
      }
    }
    setTimeout(() => setIsSearching(false), 200)
  }

  const onSelectionChange = (e: React.Key) => {
    setCrumbId(+e)
  }

  return (
    <Layout user={user} mutateUser={mutateUser} activeMenu="coa">
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className="w-full bg-gray-50">
        <div className="flex flex-col items-center bg-gray-50 mt-8">
          <div className="flex">
            <SearchField
              maxWidth="320px"
              minWidth="320px"
              placeholder="e.g. Bank"
              aria-label="Search employee"
              icon={<SearchIcon />}
              onClear={() => {
                setTimeout(() => {
                  coas.reload()
                }, 200)
              }}
              onSubmit={(e) => searchCoa(e)}
            />
          </div>
          <Flex
            isHidden={(!coas.isLoading || !coaParent.isLoading) && !isSearching}
            alignItems="center"
            flex
            alignSelf="center"
            justifyContent="center">
            <ProgressCircle aria-label="Loading…" isIndeterminate />
          </Flex>

          <div className="flex my-4 text-3x1">
            <Text flex>
              <h2 style={{ fontSize: '16px', fontWeight: 700 }}>
                Chart of Account
              </h2>
            </Text>
          </div>
          <div></div>
          {crumbId === 1 && (
            <CoaList user={user} coaParent={coaParent} coas={coas} />
          )}
        </div>
      </div>
    </Layout>
  )
}
