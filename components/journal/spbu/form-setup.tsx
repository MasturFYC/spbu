import React, { FormEvent, useEffect, useState } from 'react'
import {
  Button,
  Form,
  ComboBox,
  useDialogContainer,
  Item,
  ButtonGroup,
  Content,
  Dialog,
  Heading,
} from '@adobe/react-spectrum'
import { AsyncListData } from '@react-stately/data'

import { iCoa, linkableCoa, iLinkCoa } from '@components/interfaces'
import { LinkedCoaType } from '@lib/useCoaSetup'

type SetupSpbuParam = {
  linkedCoas: LinkedCoaType
  coas: AsyncListData<iCoa>
}

export default function SetupSpbu({ coas, linkedCoas }: SetupSpbuParam) {
  const [accReceive, setAccReceive] = useState(0)
  const [accPayment, setAccPayment] = useState(0)
  const [accPiutang, setAccPiutang] = useState(0)
  const dialog = useDialogContainer()

  useEffect(() => {
    let isLoaded = false

    if (!isLoaded) {
      let c = linkedCoas.data.getItem(1)
      if (c) setAccReceive(c.accId)
      c = linkedCoas.data.getItem(2)
      if (c) setAccPayment(c.accId)
      c = linkedCoas.data.getItem(3)
      if (c) setAccPiutang(c.accId)
    }

    return () => {
      isLoaded = true
    }
  }, [linkedCoas])

  function testDuplicate() {
    const test = [accPayment, accPiutang, accReceive]
    const dup = Array.from(new Set(test))

    if (test.length != dup.length) {
      alert('Tidak boleh memilih akun yang sama.')
      return true
    }

    return false
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (testDuplicate()) return
    dialog.dismiss()
    //linkedCoas.data.reload()
  }

  return (
    <Dialog height={'auto'} width="auto">
      <Heading
        marginTop={{ base: '0', M: '-1.5rem', L: '-1.5rem' }}
        marginEnd={{ base: '0', M: '-1.5rem', L: '-1.5rem' }}
        marginStart={{ base: '0', M: '-1.5rem', L: '-1.5rem' }}
      >
        Setup Transaksi SPBU
        <hr className="mx-0 md:-mx-4 md:-mr-12 lg:-mr-12 lg:-mx-4 my-2" />
      </Heading>
      <Content
        marginX={{ base: '0', M: '-1.5rem', L: '-1.5rem' }}
        marginBottom={{ base: '0', M: '-1.5rem', L: '-1.5rem' }}
      >
        <div>
          <Form onSubmit={onSubmit}>
            <div className="flex flex-col gap-y-1">
              <ComboBox
                width="auto"
                label="Akun pendapatan"
                selectedKey={accReceive}
                defaultItems={coas.items.filter((o) => o.linkable === linkableCoa.LINKABLE)}
                onSelectionChange={(e) => {
                  updateAcc(accReceive, 1, +e)
                }}
                placeholder={'e.g. Akun pendapatan'}
              >
                {(item) => <Item>{item.name}</Item>}
              </ComboBox>
              <ComboBox
                width="auto"
                marginTop="size-200"
                label="Akun pembayaran"
                selectedKey={accPayment}
                defaultItems={coas.items.filter((o) => o.linkable === linkableCoa.LINKABLE)}
                onSelectionChange={(e) => {
                  updateAcc(accPayment, 2, +e)
                }}
                placeholder={'e.g. Akun pembayan'}
              >
                {(item) => <Item>{item.name}</Item>}
              </ComboBox>
              <ComboBox
                width="auto"
                marginTop="size-200"
                label="Akun piutang pelanggan"
                selectedKey={accPiutang}
                defaultItems={coas.items.filter((o) => o.linkable === linkableCoa.LINKABLE)}
                onSelectionChange={(e) => {
                  updateAcc(accPiutang, 3, +e)
                }}
                placeholder={'e.g. Akun piutang pelanggan'}
              >
                {(item) => <Item>{item.name}</Item>}
              </ComboBox>

              <ButtonGroup marginTop="size-300" width="auto">
                <div className="flex flex-row w-full justify-end gap-x-0">
                  {/* <Button
                    flex
                    type="button"
                    minWidth="size-1200"
                    variant="secondary"
                    onPress={() => dialog.dismiss()}
                  >
                    Batal
                  </Button> */}
                  <Button flex type="submit" variant="cta" minWidth="size-1200">
                    Reload
                  </Button>
                </div>
              </ButtonGroup>
            </div>
          </Form>
        </div>
      </Content>
    </Dialog>
  )

  async function updateAcc(prev: number, id: number, accId: number) {
    if (linkedCoas.data.items.filter((x) => x.accId === accId && x.id != id).length > 0) {
      alert('Tidak dapat memilih akun yang sama untuk transaksi SPBU.')
      return
    }

    if (prev === 0) {
      const acc = await linkedCoas.insert({
        accId: accId,
        id: id,
        code: 'SPB',
      })

      if (acc) {
        linkedCoas.data.insert(0, {
          accId: acc,
          id: id,
          code: 'SPB',
        })
        switch (id) {
          case 1:
            setAccReceive(acc)
            break
          case 2:
            setAccPayment(acc)
            break
          case 3:
            setAccPiutang(acc)
            break
        }
      }
    } else {
      const acc = await linkedCoas.update({
        accId: +accId,
        id: id,
        code: 'SPB',
      })

      if (acc) {
        linkedCoas.data.update(id, {
          accId: acc,
          id: id,
          code: 'SPB',
        })
        switch (id) {
          case 1:
            setAccReceive(acc)
            break
          case 2:
            setAccPayment(acc)
            break
          case 3:
            setAccPiutang(acc)
            break
        }
      }
    }
  }
}
