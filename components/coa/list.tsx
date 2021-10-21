import React from 'react'
import {
  View,
  Flex,
  Text,
  DialogContainer,
  ActionButton,
} from '@adobe/react-spectrum'
import { AsyncListData } from '@react-stately/data'

import { iCoaParent, iUserLogin, iCoa } from '../interfaces'
import { initCoa } from '../../lib/use-coa'
import EditIcon from '@spectrum-icons/workflow/Edit'
import { CoaForm } from './form'

type coaListParam = {
  user?: iUserLogin
  coas: AsyncListData<iCoa>
  coaParent: AsyncListData<iCoaParent>
}

const footerWidth = { base: '320px', L: 'size-1600', M: 'size-1600' }

const CoaList = (params: coaListParam) => {
  const { user, coas, coaParent } = params
  const [open, setOpen] = React.useState(false)
  const [coa, setCoa] = React.useState<iCoa>(initCoa)
  let [message, setMessage] = React.useState<string | undefined>(undefined)
  const updateData = async (method: string, id: number, p: iCoa) => {
    const url = `/api/coa/${id}`
    const fetchOptions = {
      method: method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(p),
    }

    const res = await fetch(url, fetchOptions)
    const data: iCoa | any = await res.json()

    if (res.status === 200) {
      setMessage('Data sudah tersimpan di server.')
      if (id === 0) {
        coas.insert(-1, data)
      } else {
        coas.update(id, data)
      }
      setCoa(data)
      setOpen(false)
      //mutateCOA([...coas, data], true); //coas, true);
    } else {
      setMessage('Data tidak dapat disimpan, lihat server log...')
    }
  }

  const deleteData = async () => {
    const url = `/api/coa/${coa.id}`
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }

    const res = await fetch(url, fetchOptions)
    const data: iCoa | any = await res.json()

    if (res.status === 200) {
      coas.remove(coa.id)
      setCoa(coas.getItem(0))
      //      mutateCOA(coas, true);
      setMessage('Data sudah sudah dihapus dari server;')
      setOpen(false)
    } else {
      setMessage('Data akun tidak dapat dihapus;')
    }
  }

  const onCOAChange = (p: iCoa) => {
    updateData(p.id === 0 ? 'POST' : 'PUT', p.id, p)
  }

  return (
    <>
      <DialogContainer
        type={'modal'}
        onDismiss={() => setOpen(false)}
        isDismissable>
        {open && (
          <CoaForm
            coa={coa}
            coaParent={coaParent}
            onCOAChange={onCOAChange}
            onDelete={deleteData}>
            <View marginTop="size-200" isHidden={message === ''}>
              <div>{message}</div>
              <style jsx>{`
                div {
                  padding: 1rem;
                  color: orangered;
                  background-color: palegoldenrod;
                }
              `}</style>
            </View>
          </CoaForm>
        )}
      </DialogContainer>
      <div className="flex flex-wrap w-full md:w-3/4">
        {coas.items.map((item) => (
          <div
            key={item.id}
            className="w-full md:w-1/2 lg:w-4/12 p-2 justify-center">
            <div className="p-2 h-full bg-white border border-indigo-400 rounded-md">
              <div className="flex flex-row">
                <div className="w-full">
                  ({item.code.toString().padStart(4, '0')}){' - '}
                  <b>{item.id === 0 ? 'Akun Baru' : item.name}</b>
                </div>
                <div className="w-10">
                  <ActionButton
                    isQuiet
                    isHidden={user?.role !== 'Admin' && user?.role !== 'Owner'}
                    type="button"
                    onPress={() => {
                      setMessage('')
                      //console.log(item)
                      setCoa(item)
                      setOpen(true)
                    }}
                    aria-label="Button open COA">
                    <EditIcon />
                  </ActionButton>
                </div>
              </div>
              <div>{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export function checkParent(a: number, b: number): boolean {
  if (a === 0) return true
  // if (b === 0 && b.toString().length < 3) return true;
  let test = b.toString()
  let f = test[0]
  let len = test.length
  let x = f.padEnd(len, '0')
  //console.log(x);
  if (a < parseInt(x)) return true
  return false
}
export default CoaList
