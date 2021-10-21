import React from 'react';
import {
  Breadcrumbs,
  Item,
  View
} from '@adobe/react-spectrum';
import { iUserLogin } from './interfaces';

type crumbMenuType = {
  selectedCrumb: number,
  user?: iUserLogin;
  onCrumbChanged?: (e: React.Key) => void;
}
const CrumbMenu = (menu: crumbMenuType) => {
  let crumbs = [
    { id: 1, label: 'COA' },
    { id: 2, label: 'Akun Induk' },
    { id: 3, label: 'Akun' }
  ]
  let { user, selectedCrumb, onCrumbChanged } = menu;

  return (
    <Breadcrumbs
       onAction={onCrumbChanged} isMultiline showRoot>
    {crumbs.filter(f=>f.id <= selectedCrumb).map((c) => (
      <Item key={c.id}>{c.label}</Item>
    ))}
  </Breadcrumbs>
  )
}

export default CrumbMenu;
export type { crumbMenuType };
