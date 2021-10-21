import moment from 'moment'
import { TextField, Text, Flex, Form, View, TextArea, Button, Divider } from '@adobe/react-spectrum'
import React, { FormEvent } from 'react'
import { iCovid } from '../interfaces'

type vac2FormParam = {
  data: iCovid
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitData: (method: string, p: iCovid) => void
}

export const initCovid = {
  id: 0,
  ticket: '',
  nik: '',
  name: '',
  birthDate: moment(new Date()).format('YYYY-MM-DD'),
  phone: '',
  address: '',
  vaccins: [],
  isSelected: false,
}

export default function Vac2Form({
  data: people,
  submitData,
  setOpen,
}: vac2FormParam): JSX.Element {
  const [data, setData] = React.useState<iCovid>(initCovid)
  const [oldId, setOldId] = React.useState<number>()
  const [submitOption, setSubmitOption] = React.useState('cancel')

  const isNameValid = React.useMemo(() => data && data.name && data.name.length > 0, [data])
  const isNextBatchValid = React.useMemo(() => data && data.ticket.length > 0, [data])
  const isNikValid = React.useMemo(() => data && data.nik.length > 0, [data])

  React.useEffect(() => {
    let isLoaded = false

    if (!isLoaded) {
      setData({ ...people })
      setOldId(people.id)
    }

    return () => {
      isLoaded = true
    }
  }, [people])

  const handleChange = (name: string, value: string | number) => {
    const test = { ...data, [name]: value }
    setData((o) => ({ ...o, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    submitData(submitOption, data)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <View>
        <Flex direction={{ base: 'column', M: 'row' }} gap="size-200">
          <TextField
            width="100%"
            label="Ticket"
            autoFocus
            placeholder="e.g Q-123654"
            onChange={(e) => handleChange('ticket', e.toUpperCase())}
            value={data.ticket}
          />
          <TextField
            width="100%"
            label="Name"
            placeholder="e.g Doni Armadi"
            onChange={(e) => handleChange('name', e)}
            value={data.name}
          />
        </Flex>
      </View>
      <View>
        <Flex direction={{ base: 'column', M: 'row' }} gap="size-200">
          <TextField
            flex
            width={{ base: '100%' }}
            type="date"
            label="Birth Date"
            value={moment(data.birthDate).format('YYYY-MM-DD')}
            onChange={(e) => handleChange('birthDate', moment(e).format('YYYY-MM-DD'))}
          />
          <TextField
            width="100%"
            label="NIK"
            placeholder="e.g 123646574987"
            onChange={(e) => handleChange('nik', e)}
            value={data.nik}
          />
          <TextField
            label="Phone"
            width="100%"
            inputMode="tel"
            placeholder="e.g 085321073564"
            onChange={(e) => handleChange('phone', e)}
            value={data.phone}
          />
        </Flex>
      </View>
      <View>
        <Flex direction={{ base: 'column', M: 'row' }} gap="size-100">
          <TextArea
            label="Address"
            width="100%"
            placeholder="e.g Blok Sindupraja Ds. Telukagung Indramayu"
            onChange={(e) => handleChange('address', e)}
            value={data.address}
          />
        </Flex>
      </View>

      <View marginY="size-200">
        <Flex direction={'row'} gap="size-100">
          <Button
            variant="negative"
            type="submit"
            onPress={() => setSubmitOption('delete')}
            isDisabled={oldId ? false : true}
          >
            Delete
          </Button>
          <Button variant="secondary" onPress={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onPress={() => setSubmitOption(oldId ? 'put' : 'post')}
            variant="cta"
            type="submit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 22.8 24"
              stroke="none"
            >
              <path
                fill="currentColor"
                d="M22.3,0h-3.8H4.3H0.4C0.2,0,0,0.2,0,0.4v19.2c0,0.1,0,0.2,0.1,0.3l3.9,3.9C4.1,24,4.3,24,4.4,24h1.2h12h4.8
		c0.2,0,0.4-0.2,0.4-0.4V0.4C22.8,0.2,22.6,0,22.3,0z M18.1,0.9v9.6H4.8V0.9H18.1z M6,23.1v-7.3h11.1v7.3H6z M21.9,23.1H18v-7.8
		c0-0.2-0.2-0.4-0.4-0.4h-12c-0.2,0-0.4,0.2-0.4,0.4v7.8H4.6l-3.7-3.7V0.9h3v10.1c0,0.2,0.2,0.4,0.4,0.4h14.3c0.2,0,0.4-0.2,0.4-0.4
		V0.9h2.9V23.1z"
              />
              <path
                fill="currentColor"
                d="M11.5,16.4H9.3c-0.2,0-0.4,0.2-0.4,0.4v5.3c0,0.2,0.2,0.4,0.4,0.4h2.2c0.2,0,0.4-0.2,0.4-0.4v-5.3
		C11.9,16.6,11.7,16.4,11.5,16.4z M11,21.7H9.7v-4.4H11V21.7z"
              />{' '}
            </svg>
            <Text>Save</Text>
          </Button>
        </Flex>
      </View>
      <Divider size="S" />
    </Form>
  )
}
