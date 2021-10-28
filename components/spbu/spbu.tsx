import React from 'react'
import { Image, Flex, View, DialogContainer } from '@adobe/react-spectrum'
import { iSpbu } from '../interfaces'
import { useSpbu } from '../../lib/use-spbu'
import { SpbuForm } from './form'
import WaitMe from '@components/ui/wait-me'
import { SpanLink } from '../ui/SpanLinkProps'

const defaultUrl = '/api/spbu'

const title = 'SPBU List'
const initSpbu: iSpbu = {
  id: 0,
  name: '',
  code: '',
  street: '',
  city: '',
  phone: '',
}

const SpbuList = ({ role }: { role?: string }) => {
  let spbus = useSpbu()
  const [spbu, setSpbu] = React.useState<iSpbu>(initSpbu)
  const [open, setOpen] = React.useState(false)

  if (spbus.isLoading) return <WaitMe />

  const updateData = async (method: string, id: number, p: iSpbu) => {
    const url = `${defaultUrl}/${id}`
    const fetchOptions = {
      method: method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(p),
    }

    const res = await fetch(url, fetchOptions)
    const data: iSpbu | any = await res.json()

    if (res.status === 200) {
      if (id === 0) {
        spbus.insert(0, data)
      } else {
        spbus.update(id, data)
      }
      setOpen(false)
    }
  }

  const handleSubmit = (e: iSpbu) => {
    updateData(e.id === 0 ? 'POST' : 'PUT', e.id, e)
  }

  const deleteData = async () => {
    const url = `${defaultUrl}/${spbu.id}`
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }

    const res = await fetch(url, fetchOptions)
    const data: iSpbu | any = await res.json()

    if (res.status === 200) {
      setOpen(false)
      spbus.remove(spbu.id)
    } else {
      console.log('SPBU cannot be removed!')
    }
  }

  return (
    <>
      <DialogContainer type={'modal'} onDismiss={() => setOpen(false)} isDismissable>
        {open && <SpbuForm spbu={spbu} onDelete={deleteData} updateList={handleSubmit} />}
      </DialogContainer>
      <Flex marginY="size-400" justifyContent="center" gap="size-100" wrap>
        {spbus &&
          spbus.items
            .filter((o) => (role === 'Admin' || role === 'Owner' ? o.id >= 0 : o.id > 0))
            .map((p, i) => (
              <View
                key={p.id}
                width={{ base: '100%', M: 'size-3400' }}
                borderColor="purple-400"
                borderRadius="medium"
                borderWidth="thin"
                padding="size-200"
                marginX={{base:"size-100"}}
              >
                {role === 'Admin' || role === 'Owner' ? (
                  <SpanLink
                    onClick={() => {
                      setSpbu(p)
                      setOpen(true)
                    }}
                  >
                    {p.id === 0 ? 'New SPBU' : `SPBU ${p.code}`}
                  </SpanLink>
                ) : (
                  <SpanLink
                    onClick={() => {
                      setSpbu(p)
                      setOpen(true)
                    }}
                  >
                    SPBU {p.code}
                  </SpanLink>
                )}
                {p.id > 0 && (
                  <div>
                    <div>
                      {p.name}
                      <br />
                      {p.street}
                      {p.city && `, ${p.city}`}
                    </div>
                    <div>{p.phone}</div>
                    <div>
                      {p.employees && (
                        <div>
                          <strong>Admin</strong> :{' '}
                          {p.employees
                            ?.filter((o) => o.role === 'Admin')
                            .map((o) => (
                              <span key={o.id}>{o.name}</span>
                            ))}
                        </div>
                      )}
                    </div>
                    <div>
                      {spbus && (
                        <div>
                          <strong>Operator</strong> :{' '}
                          {p.employees
                            ?.filter((o) => o.role === 'Operator')
                            .map((o) => (
                              <div key={o.id}>
                                <span>{o.name}</span>
                                <Image
                                  alt="photo-operator"
                                  src={`https://ik.imagekit.io/at4uyufqd9s/tr:w-64,h-80/${o.photo}?`}
                                  width="32px"
                                />
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </View>
            ))}
      </Flex>
    </>
  )
}

export default SpbuList
