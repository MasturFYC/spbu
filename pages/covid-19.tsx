import Head from 'next/head'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { useAsyncList } from '@react-stately/data'
import {
  Text,
  Flex,
  ProgressCircle,
  View,
  Button,
  Tabs,
  Item,
  TabList,
} from '@adobe/react-spectrum'
import Layout, { siteTitle } from '../components/layout'
import useUser from '@lib/use-user'
const Vac1List = dynamic(() => import('@components/vac1'))
const Vac2List = dynamic(() => import('@components/vac2'))

export default function Covid19() {
  const { user, mutateUser } = useUser()
  const [showChild, setShowChild] = React.useState(false)
  const [tab, setTab] = useState<string | number>('vac1')

  // let list = useAsyncList<iCovid>({
  //   async load() {
  //     let json: iCovid[] = (await import('../shared/jsons/data.json')).default
  //     return { items: json }
  //   },
  //   getKey: (item: iCovid) => item.id,
  // })

  // React.useEffect(() => {
  //   setShowChild(true)
  // }, [])

  if (user?.login !== 'Mastur' && user?.login !== 'Agung') {
    return (
      <Layout activeMenu="covid" user={user}>
        <Flex direction="column">
          <p>Welcome to the Jungle</p>
          <h3>FORBIDDEN!</h3>
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout activeMenu="covid" user={user}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Flex alignItems="center" alignContent="center" direction="column">
        <Tabs
          marginTop="size-500"
          marginBottom="size-300"
          orientation={'horizontal'}
          aria-label="Mesozoic time periods"
          density="regular"
          maxWidth="size-5000"
          onSelectionChange={setTab}
          selectedKey={tab}
        >
          <TabList alignSelf="center">
            <Item key={'vac1'}>Vaksin Card Model 1</Item>
            <Item key={'vac2'}>Vaksin Card Model 2</Item>
          </TabList>
        </Tabs>
      </Flex>

      {tab === 'vac1' ? <Vac1List user={user} /> : <Vac2List />}
    </Layout>
  )
}
