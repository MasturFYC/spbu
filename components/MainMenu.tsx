import React, { ReactHTMLElement, Ref, useState } from 'react'
import Link from 'next/link'
import { iUserLogin } from './interfaces'
import fetchJson from '@lib/fetch-json'
import { NextRouter } from 'next/router'
import useClickOutside from './useClickOutside'
import { Flex } from '@react-spectrum/layout'
import { View } from '@react-spectrum/view'
import { Item, TabList, Tabs } from '@react-spectrum/tabs'
import { Divider } from '@react-spectrum/divider'
import { Image } from '@react-spectrum/image'
import { ActionButton } from '@react-spectrum/button'

import { Menu } from '@react-spectrum/menu'
import { MenuTrigger } from '@react-spectrum/menu'
import useIsMobile from '@lib/useIsMobile'

export type menuType = {
  selectedMenu: string
  user?: iUserLogin
  onSelectionChange?: (e: React.Key) => void
}
const companyName = 'PT. BUANA MIGAS PRATAMA'

interface iTab {
  id: string
  name: string
  link: string
  lineColor: string
  svg?: string[]
  urlIcon?: string
  viewBox?: string
}

const tabs: iTab[] = [
  { id: 'spbu', name: 'SPBU', link: '/spbu', lineColor: 'border-pink-600' },
  {
    id: 'product',
    name: 'Products',
    link: '/product',
    lineColor: 'border-purple-600',
    svg: [
      `M21,5H18.6489A3.46,3.46,0,0,0,19,3.5,3.5042,3.5042,0,0,0,15.5,0,5.153,5.153,0,0,0,11,3.1392,5.153,5.153,0,0,0,6.5,0,3.5042,3.5042,0,0,0,3,3.5,3.46,3.46,0,0,0,3.3511,5H1A1,1,0,0,0,0,6v5a1,1,0,0,0,1,1H2v9a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V12h1a1,1,0,0,0,1-1V6A1,1,0,0,0,21,5ZM15.5,2a1.5,1.5,0,0,1,0,3H12.3457C12.8164,3.7593,13.7871,2,15.5,2ZM5,3.5A1.5017,1.5017,0,0,1,6.5,2C8.2129,2,9.1831,3.7593,9.6543,5H6.5A1.5017,1.5017,0,0,1,5,3.5ZM2,7h8v3H2Zm2,5h6v8H4Zm14,8H12V12h6Zm2-10H12V7h8Z`,
    ],
    viewBox: '0 0 22 22',
  },
  {
    id: 'employee',
    name: 'Employees',
    link: '/employee',
    lineColor: 'border-green-600',
    svg: [
      `M13,12H5a5.0059,5.0059,0,0,0-5,5v6a1,1,0,0,0,2,0V17a3.0033,3.0033,0,0,1,3-3h8a3.0033,3.0033,0,0,1,3,3v6a1,1,0,0,0,2,0V17A5.0059,5.0059,0,0,0,13,12Z`,
      `M9,10A5,5,0,1,0,4,5,5.0059,5.0059,0,0,0,9,10ZM9,2A3,3,0,1,1,6,5,3.0033,3.0033,0,0,1,9,2Z`,
      `M20.25,12.1621a1,1,0,1,0-.5,1.9356A3.0009,3.0009,0,0,1,22,17v6a1,1,0,0,0,2,0V16.999A4.9994,4.9994,0,0,0,20.25,12.1621Z`,
      `M16.248.1611a1,1,0,1,0-.496,1.9375,3,3,0,0,1,0,5.8125,1,1,0,1,0,.496,1.9375,5,5,0,0,0,0-9.6875Z`,
    ],
    viewBox: '0 0 24 24',
  },
  { id: 'coa', name: 'C O A', link: '/coa', lineColor: 'border-red-600' },
  {
    id: 'journal',
    name: 'Journal',
    link: '/journal',
    lineColor: 'border-gray-600',
    urlIcon: '/icons/journal.svg',
  },
  {
    id: 'stock',
    name: 'Stock',
    link: '/stock',
    lineColor: 'border-yellow-600',
  },
  {
    id: 'covid',
    name: 'Covid-19',
    link: '/covid-19',
    lineColor: 'border-blue-600',
  },
]

export default function TabMainMenu({
  home,
  user,
  mutateUser,
  router,
  activeMenu = 'SPBU',
}: {
  activeMenu: string | undefined
  home?: boolean
  user?: iUserLogin
  mutateUser?: (data?: any, shouldRevalidate?: boolean | undefined) => Promise<any>
  router: NextRouter
}) {
  const [hideMenu, setHideMenu] = React.useState(true)
  const [hideMenuUser, setHideMenuUser] = React.useState(true)
  // const userRef = React.useRef<HTMLElement>(null)
  // const mainRef = React.useRef<HTMLButtonElement>(null)
  const [tab, setTab] = useState<string | undefined>(activeMenu)

  const isMobile = useIsMobile()

  const showMenu = () => {
    setHideMenu(!hideMenu)
  }

  const showMenuUser = () => setHideMenuUser(!hideMenuUser)

  // useClickOutside(userRef, () => {
  //   if (hideMenuUser) return null
  //   setHideMenuUser(true)
  // })

  // useClickOutside(mainRef, () => {
  //   if (hideMenu) return null
  //   setHideMenu(true)
  // })

  const onMenuChange = async (e: React.Key) => {
    switch (e) {
      case 'login':
        router.push('/login')
        break
      case 'logout':
        if (mutateUser) {
          await mutateUser(fetchJson('/api/logout', { method: 'POST' }), false)
        }
        router.push('/')
        break
      case 'profile':
        router.push('/profile')
        break
    }
  }

  return (
    <View width="100%">
      <Flex
        // id="header"
        direction="column"
      >
        <View flex paddingY={'size-50'} paddingX={{ base: 'size-100', M: 'size-400' }}>
          <Flex direction="row" alignItems="center">
            <View flex>
              <Flex direction="row" alignItems="center">
                <View width={40} height={40} alignSelf="center" paddingTop="size-50">
                  <Link href="/">
                    <a>
                      <Image
                        objectFit="cover"
                        src="https://ik.imagekit.io/at4uyufqd9s/tr:w-40/spbu/logo.svg"
                        alt={companyName}
                      />
                    </a>
                  </Link>
                </View>
                <View isHidden={{ base: true, M: false }}>
                  <Link href="/">
                    <a
                      style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        marginLeft: '12px',
                      }}
                    >
                      {companyName}
                    </a>
                  </Link>
                </View>
              </Flex>
            </View>
            <View>
              {user?.isLoggedIn ? (
                <MenuTrigger aria-label="menu-1">
                  <ActionButton isQuiet aria-label="button-1">
                    <View borderRadius="large" flex width="24px">
                      <Image
                        objectFit="cover"
                        src={`https://ik.imagekit.io/at4uyufqd9s/tr:w-24${user?.photo}`}
                        alt="User Image"
                      />
                      <View width={10} justifySelf="center" marginX={6}>
                        <svg
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 129 129"
                          enableBackground="new 0 0 129 129"
                        >
                          <g>
                            <path d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z" />
                          </g>
                        </svg>
                      </View>
                    </View>
                    <span style={{ marginLeft: '6px' }}>{'Hi, ' + user?.login}</span>
                  </ActionButton>
                  <Menu onAction={(e) => onMenuChange(e)}>
                    <Item key="profile">Profile</Item>
                    <Item key="logout">Logout</Item>
                  </Menu>
                </MenuTrigger>
              ) : (
                <MenuTrigger aria-label="menu-2">
                  <ActionButton isQuiet aria-label="button-2">
                    <View borderRadius="large" flex width="24px">
                      <Image
                        objectFit="cover"
                        src={'https://ik.imagekit.io/at4uyufqd9s/tr:w-24/spbu/logo.svg'}
                        alt="User Image"
                      />
                    </View>
                    <span style={{ marginLeft: '6px' }}>User</span>
                  </ActionButton>

                  <Menu onAction={(e) => onMenuChange(e)}>
                    <Item key="login">Login</Item>
                  </Menu>
                </MenuTrigger>
              )}
            </View>

            <View isHidden={{ base: false, M: true }} marginStart="size-150">
              <button onClick={() => showMenu()}>
                <svg
                  className="fill-current h-3 w-3"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Menu</title>
                  <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
              </button>
            </View>
          </Flex>
        </View>
        <View
          width="100vh"
          zIndex={1}
          backgroundColor="static-gray-50"
          isHidden={{ base: hideMenu, M: false }}
          marginX={{ base: 'size-50', M: 'size-200' }}
          position={isMobile ? 'absolute' : 'relative'}
          top={isMobile ? 64 : 0}
        >
          <Tabs
            flex
            orientation={isMobile ? 'vertical' : 'horizontal'}
            aria-label="Main menu tab"
            density="regular"
            isQuiet
            items={tabs}
            onSelectionChange={(e) => {
              setTab(e.toString())
            }}
            selectedKey={tab}
          >
            <TabList>
              {(item: iTab) => (
                <Item>
                  <Link href={item.link}>
                    <a style={{ cursor: 'pointer' }}>{item.name}</a>
                  </Link>
                </Item>
              )}
            </TabList>
          </Tabs>
        </View>
      </Flex>
      <Divider size="S" />
    </View>

  )
}
