import React from 'react'
import { View, Flex, SearchField, Button } from '@adobe/react-spectrum'
import { Cell, Column, Row, TableView, TableBody, TableHeader } from '@react-spectrum/table'

//import moment from 'moment';
import { iUserLogin, iJournal, dateOnly } from '../interfaces'
import WorkDate from '@spectrum-icons/workflow/Date'
//import { JournalForm } from './form';
import { initJournal, useJournal } from '../../lib/use-journal'
import JournalContext, { JournalContextParam } from '../../lib/journal-provider'

type journalListParam = {
  user?: iUserLogin
}

const footerWidth = { base: '320px', L: 'size-1600', M: 'size-1600' }

const JournalList = ({ user }: journalListParam) => {
  const { source, journal } = React.useContext<JournalContextParam>(JournalContext)
  const [txtSearch, setTxtSearch] = React.useState<string>('')
  let [message, setMessage] = React.useState<string | undefined>(undefined)
  let [selectedId, setSelectedId] = React.useState<number>(0)

  return (
    <Flex direction={'row'} wrap flex>
      <View flex>
        <Flex direction={'column'} gap="size-300" justifyContent="center" wrap>
          <View flex alignSelf="center" marginTop="size-300">
            <SearchField
              flex
              value={txtSearch}
              placeholder="e.g. BON-0000001"
              aria-label="Search journal"
              icon={<WorkDate />}
              minWidth="320px"
              onChange={(e) => setTxtSearch(e)}
              onClear={() => source.searchJournal('', true)}
              onSubmit={(e) => {
                source.searchJournal(txtSearch, false)
              }}
            />
          </View>
          <View flex justifySelf="center" marginBottom="size-300">
            <TableJournal selectedChange={setSelectedId} />
          </View>
        </Flex>
      </View>
      <View
        flex
        maxWidth={{ M: '225px', L: '225px' }}
        marginTop={{ base: 'size-50', M: 'size-800', L: 'size-800' }}
        //minWidth={{ base: '100%', M: 'size-2400', L: 'size-2400' }}
      >
        <View padding={{ base: 'size-100', M: 'size-200', L: 'size-200' }} marginBottom="size-300">
          <Button
            variant="primary"
            onPress={() => {
              const j = journal.getItem(selectedId)
              if (j) {
                const code = j.code
                if (j.code === 'ORD') {
                  source.gotoPage('order')
                } else if (j.code === 'JRU') {
                  source.gotoPage('transaksi')
                } else if (j.code === 'SPB') {
                  source.gotoPage('spbu')
                }
              }
            }}
            isDisabled={selectedId === 0}
          >
            Edit
          </Button>
        </View>
        <span>{message}</span>
      </View>
    </Flex>
  )
}

type colType = {
  id: number
  name: string
  uid: string
  align: 'start' | 'center' | 'end' | undefined
}

type rowType = {
  id: number
  name: string
  date: string
  type: string
}

function TableJournal({
  selectedChange,
}: {
  selectedChange: React.Dispatch<React.SetStateAction<number>>
}) {
  const [showChild, setShowChild] = React.useState(false)

  const { journal, source } = React.useContext<JournalContextParam>(JournalContext)

  let columns: colType[] = [
    { uid: 'dateOutput', id: 0, name: 'Tanggal', align: 'center' },
    { uid: 'proof', id: 1, name: 'Ref', align: 'start' },
    { uid: 'memo', id: 2, name: 'Memo', align: 'start' },
    { uid: 'tags', id: 3, name: 'Tags', align: 'start' },
    //{ uid: 'totalCred', id: 4, name: 'Credit', align: 'end' },
  ]

  React.useEffect(() => {
    setShowChild(true)
  }, [])
  if (!showChild) {
    // You can show some kind of placeholder UI here
    return null
  }
  return (
    <TableView
      flex
      density="compact"
      aria-label="Example table with dynamic content"
      onSelectionChange={(e) => {
        if (e && [...e].filter((x) => x !== e)) {
          const i = +[...e].filter((x) => x !== e) | 0
          source.setSelected(i)
          selectedChange(i)
        } else {
          source.setSelected(0)
          selectedChange(0)
        }
      }}
      selectionMode="single"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <Column key={column.uid} align={column.align}>
            {column.name}
          </Column>
        )}
      </TableHeader>
      <TableBody items={journal.items}>
        {(item) => (
          <Row key={item.id}>
            {(cell) => (
              <Cell>
                {
                  // @ts-ignore
                  item[cell]
                }
                {/* {cell === 'dateTransact'
                  ? dateOnly(item[cell], 'DD-MMM-YYYY')
                  : // @ts-ignore
                    item[cell]} */}
              </Cell>
            )}
          </Row>
        )}
      </TableBody>
    </TableView>
  )
}

export function checkParent(a: number, b: number): boolean {
  if (a === 0) return true
  if (a.toString().length === b.toString().length - 1) return true
  return false
}

export default JournalList
