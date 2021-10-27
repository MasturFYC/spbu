import moment from 'moment'
import React, { FormEvent } from 'react'
import { TextField, Text, Flex, View, TextArea, Button } from '@adobe/react-spectrum'
import { Dialog, useDialogContainer } from '@react-spectrum/dialog'
import { ButtonGroup } from '@react-spectrum/buttongroup'
import { Content } from '@react-spectrum/view'
import { Heading } from '@react-spectrum/text'
import { Form } from '@react-spectrum/form'
import { Divider } from '@react-spectrum/divider'
import SaveIcon from '@spectrum-icons/workflow/SaveFloppy'

import { iCovid } from '../interfaces'

type vac2FormParam = {
  data: iCovid
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

export default function Vac2Form({ data: people, submitData }: vac2FormParam): JSX.Element {
  const [data, setData] = React.useState<iCovid>(initCovid)
  const [oldId, setOldId] = React.useState<number>()
  const [submitOption, setSubmitOption] = React.useState('cancel')
  const dialog = useDialogContainer()

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
    <Dialog size="L">
      <Heading>{data.id > 0 ? data.name : 'New people'}</Heading>
      <Divider size="S" />

      <Content>
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
                width={{ base: '100%', M: '33.33%' }}
                type="date"
                label="Birth Date"
                value={moment(data.birthDate).format('YYYY-MM-DD')}
                onChange={(e) => handleChange('birthDate', moment(e).format('YYYY-MM-DD'))}
              />
              <TextField
                width={{ base: '100%', M: '33.33%' }}
                label="NIK"
                placeholder="e.g 123646574987"
                onChange={(e) => handleChange('nik', e)}
                value={data.nik}
              />
              <TextField
                label="Phone"
                width={{ base: '100%', M: '33.33%' }}
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

          <ButtonGroup marginTop="size-200">
            <Flex direction={'row'} flex>
              <Flex direction={'row'} flex>
                <Button
                  onPress={() => {
                    setSubmitOption(oldId ? 'put' : 'post')
                    dialog.dismiss()
                  }}
                  variant="cta"
                  type="submit"
                >
                  <SaveIcon />
                  <Text>Save</Text>
                </Button>
                <Button isHidden={{base:true,M:false}} variant="secondary" onPress={() => dialog.dismiss()}>
                  Cancel
                </Button>
              </Flex>
                <Button
                  variant="negative"
                  type="submit"
                  onPress={() => {
                    setSubmitOption('delete')
                    dialog.dismiss()
                  }}
                  isDisabled={oldId ? false : true}
                >
                  Delete
                </Button>
            </Flex>
          </ButtonGroup>
        </Form>
      </Content>
    </Dialog>
  )
}
