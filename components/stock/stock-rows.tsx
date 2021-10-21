import Link from 'next/link'
import React, { EventHandler, useCallback, useState } from 'react'
import { AsyncListData } from '@react-stately/data'
import { useAsyncList } from '@react-stately/data'
import moment from 'moment'
import {
  Button,
  Text,
  NumberField,
  TextArea,
  ComboBox,
  Item,
  ButtonGroup,
  ActionButton,
} from '@adobe/react-spectrum'
import AddTo from '@spectrum-icons/workflow/AddTo'
import AddItem from '@spectrum-icons/workflow/Add'
import RemoveFrom from '@spectrum-icons/workflow/Remove'
import {
  iProductSold,
  iOrder,
  generateId,
  initProduct,
  iLinkCoa,
  linkableCoa,
  iJournalDetail,
  iJournal
} from '@components/interfaces'
import JournalContext, { JournalContextParam } from '@lib/journal-provider'
import { Label } from '@components/styled-components/Label'
import { FormatNumber } from '@lib/format'
import { initJournalDetail, useJournalOrderPayment } from '@lib/use-journal-detail'
import WaitMe from '@components/ui/wait-me'
import router from 'next/router'

type StockRowParams = {
  stock: AsyncListData<iJournal>
}

export default function StockRows({stock}: StockRowParams) {

  return (
    <div className="w-full">
      {
        stock.items.map(o => 
          <div key={o.id} className="flex flex-row gap-x-4">
            <div className="flex-1">
              <Link href={`?s=${router.query.s}&e=${router.query.e}&id=${o.id}`}>
              <a className="hover:underline">{o.proof}</a>
              </Link>
            </div>
            <div className="flex-1">{o.dateOutput}</div>
          </div>
        )
      }
    </div>
  )
}
