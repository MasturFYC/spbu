import React from 'react'
import { Item, TabList, Tabs, View } from '@adobe/react-spectrum'
import { iUserLogin } from '../interfaces'

export type menuType = {
  selectedMenu: string
  user?: iUserLogin
  onSelectionChange?: (e: React.Key) => void
}

export default function JournalMenu(menu: menuType) {
  const { selectedMenu, user, onSelectionChange } = menu
  const tabs = [
    { id: 'journal', name: 'Journal', link: '/spbu' },
    { id: 'ledger', name: 'Ledger', link: '/product' },
    { id: 'transaksi', name: 'Jurnal Umum', link: '/product' },
    { id: 'order', name: 'Penjualan', link: '/order' },
    { id: 'spbu', name: 'SPBU', link: '/spbu' },
    { id: 'stock', name: 'Pembelian', link: '/stock' },
    { id: 'laporan', name: 'Report', link: '/employee' },
  ]

  return (
    <Tabs
      orientation={'vertical'}
      items={tabs}
      aria-label="Mesozoic time periods"
      density="compact"
      onSelectionChange={onSelectionChange}
      selectedKey={selectedMenu}
    >
      <TabList>
        {tabs.map((item) => (
          <Item aria-label={`Tab index label`} key={item.id}>
            {item.name}
          </Item>
        ))}
      </TabList>
    </Tabs>
  )
}
