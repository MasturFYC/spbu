import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { iUserLogin } from './interfaces'
import fetchJson from '@lib/fetch-json'
import { NextRouter } from 'next/router'
import useClickOutside from './useClickOutside'
import myLoader from '@lib/image-loader'

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
  activeMenu,
}: {
  activeMenu?: string
  home?: boolean
  user?: iUserLogin
  mutateUser?: (data?: any, shouldRevalidate?: boolean | undefined) => Promise<any>
  router: NextRouter
}) {
  const [hideMenu, setHideMenu] = React.useState(true)
  const [hideMenuUser, setHideMenuUser] = React.useState(true)
  const userRef = React.useRef<HTMLDivElement>(null)
  const mainRef = React.useRef<HTMLButtonElement>(null)

  const showMenu = () => {
    setHideMenu(!hideMenu)
  }

  const showMenuUser = () => setHideMenuUser(!hideMenuUser)
  useClickOutside(userRef, () => {
    if (hideMenuUser) return null
    setHideMenuUser(true)
  })

  useClickOutside(mainRef, () => {
    if (hideMenu) return null
    setHideMenu(true)
  })

  return (
    <nav id="header" className="w-full z-10 border border-t-0 border-l-0 border-r-0 border-b-1">
      <div className="flex w-full bg-gray-800 py-2 flex-row items-center px-4 md:px-8 lg:px-8">
        <div className="w-full flex flex-row items-center">
          <Link href="/">
            <a>
              <Image
                priority
                objectFit="contain"
                src="/spbu/logo.svg"
                loader={myLoader}
                height={40}
                width={40}
                quality={100}
                alt={companyName}
              />
            </a>
          </Link>
          <Link href="/">
            <a className="whitespace-nowrap hidden md:flex text-2x1 font-bold text-gray-100 ml-2">
              {companyName}
            </a>
          </Link>
        </div>
        <div className="flow-root">
          <div className="relative float-right">
            <div className="flex flex-row items-center justify-center cursor-pointer">
              <div
                ref={userRef}
                onClick={() => showMenuUser()}
                id="userButton"
                className="flex flex-row items-center focus:outline-none"
              >
                <div className="w-8 h-8 items-center justify-center flex">
                  <Image
                    objectFit="cover"
                    className={`${!user?.isLoggedIn && 'hidden'} rounded-full`}
                    loader={myLoader}
                    src={user?.photo || '/spbu/logo.svg'}
                    alt=""
                    width={24}
                    height={24}
                  />
                </div>
                <div
                  className={`${
                    !user?.isLoggedIn && 'hidden'
                  } mx-4 whitespace-nowrap md:inline-block ml-3 text-gray-100`}
                >
                  {user?.login ? 'Hi, ' + user?.login : 'User'}
                </div>
                <svg
                  className={`h-2 fill-current text-gray-50`}
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 129 129"
                  enableBackground="new 0 0 129 129"
                >
                  <g>
                    <path d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z" />
                  </g>
                </svg>
              </div>
            </div>
            <div
              id="userMenu"
              className={`bg-gray-800 rounded shadow-md absolute mt-12 top-0 right-0 min-w-full overflow-auto z-30 ${
                hideMenuUser && 'invisible'
              }`}
            >
              <ul className="list-reset">
                <li className={`${!user?.isLoggedIn && 'hidden'}`}>
                  <Link href="/profile">
                    <a className="px-4 py-2 block text-gray-100 hover:bg-gray-800 no-underline hover:no-underline">
                      My account
                    </a>
                  </Link>
                </li>
                <li>
                  <hr
                    className={`${!user?.isLoggedIn && 'hidden'} border-t mx-2 border-gray-400`}
                  />
                </li>
                <li className={`${!user?.isLoggedIn && 'hidden'}`}>
                  <Link href={`/api/logout`}>
                    <a
                      className="px-4 py-2 block text-gray-100 hover:bg-gray-800 no-underline hover:no-underline"
                      onClick={async (e) => {
                        e.preventDefault()
                        if (mutateUser) {
                          await mutateUser(fetchJson('/api/logout', { method: 'POST' }), false)
                          // mutateUser(
                          //   await fetchJson('/api/logout', { method: 'POST' }),
                          //   false
                          // );
                        }
                        router.push('/')
                      }}
                    >
                      Logout
                    </a>
                  </Link>
                </li>
                <li className={`${user?.isLoggedIn && 'hidden'}`}>
                  <Link href={`/login`}>
                    <a className="px-4 py-2 block text-gray-100 hover:bg-gray-800 no-underline hover:no-underline">
                      Login
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={`${hideMenu && 'lg:hidden'} ml-4`}>
          <button
            ref={mainRef}
            id="nav-toggle"
            className="flex items-center py-2 rounded text-gray-500 border-gray-600 hover:text-gray-100 hover:border-teal-500 appearance-none focus:outline-none"
            onClick={() => showMenu()}
          >
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
      </div>
      <div
        className={`w-full flex-grow lg:flex lg:items-center lg:w-auto ${
          hideMenu && 'hidden'
        } lg:block mt-0 lg:mt-0 bg-gray-100 z-20`}
        id="nav-content"
      >
        <ul className="list-reset gap-x-4 flex-1 lg:flex items-center mx-0 md:mx-4 md:px-0">
          {tabs.map((tab) => (
            <li key={tab.id} className="my-2 md:my-0">
              <Link href={tab.link}>
                <a
                  className={`flex items-center -mb-0.5 py-1 md:py-3 px-1 align-middle text-gray-700 no-underline hover:${
                    tab.lineColor
                  } ${
                    activeMenu === tab.id ? tab.lineColor : 'border-gray-100'
                  } border-b-2 hover:border-current hover:text-gray-900`}
                >
                  {tab.svg ? (
                    <svg
                      className="fill-current h-3 w-3 mr-2"
                      viewBox={tab.viewBox}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>{tab.name}</title>
                      <path d={tab.svg ? tab.svg.join(' ') : ''} />
                    </svg>
                  ) : (
                    <></>
                  )}
                  {tab.urlIcon ? (
                    <Image
                      priority
                      objectFit="contain"
                      src="/icons/journal.svg"
                      loader={myLoader}
                      height={14}
                      width={14}
                      className="h-3 w-3"
                      alt={companyName}
                    />
                  ) : (
                    <></>
                  )}
                  <span className="pl-2 pb-1 md:pb-0 text-sm">{tab.name}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
