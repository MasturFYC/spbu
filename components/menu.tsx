import React from 'react';
import { Item, TabList, Tabs, View } from '@adobe/react-spectrum';
import { iUserLogin } from './interfaces';

export type menuType = {
  selectedMenu: string;
  user?: iUserLogin;
  onSelectionChange?: (e: React.Key) => void;
};

interface iTab {
  id: string;
  name: string;
  link: string;
}
export default function TabMenu(menu: menuType) {
  const { selectedMenu, user, onSelectionChange } = menu;
  const tabs: iTab[] = [
    { id: 'spbu', name: 'SPBU', link: '/spbu' },
    { id: 'product', name: 'Products', link: '/product' },
    { id: 'employee', name: 'Employees', link: '/employee' },
    { id: 'coa', name: 'COA', link: '/coa' },
    { id: 'journal', name: 'Journal', link: '/journal' },
    { id: 'covid', name: 'Covid-19', link: '/covid-19' },
  ];

  return (
    <View
      paddingTop="size-500"
      marginBottom="size-500"
      backgroundColor="gray-200"
      borderBottomColor={'gray-400'}
      borderBottomWidth="thin">
      <Tabs
        isQuiet
        items={tabs}
        aria-label="tab-product"
        density="regular"
        marginBottom="-2px"
        onSelectionChange={onSelectionChange}
        selectedKey={selectedMenu}>
        <TabList marginX="size-500">
          {(tab: iTab) => (
            <Item aria-label={`tab-${tab.id}`} key={tab.id}>
              <span style={{ cursor: 'pointer' }}>{tab.name}</span>
            </Item>
          )}
        </TabList>
      </Tabs>
    </View>
  );
}
