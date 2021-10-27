import { NextPage } from 'next'
import React, { FormEvent } from 'react'
import moment from 'moment'

import { Content } from '@react-spectrum/view'
import { Heading, Text } from '@react-spectrum/text'
import { Form } from '@react-spectrum/form'
import { Divider } from '@react-spectrum/divider'
import { Dialog, useDialogContainer } from '@react-spectrum/dialog'

import { Flex } from '@react-spectrum/layout'
import { TextField } from '@react-spectrum/textfield'
import { ComboBox, Item } from '@react-spectrum/combobox'
import { ButtonGroup } from '@react-spectrum/buttongroup'
import { Button } from '@react-spectrum/button'
import SaveIcon from '@spectrum-icons/workflow/SaveFloppy'
import { iVac1, VacType } from '../interfaces'
import { View } from '@adobe/react-spectrum'

type vac1FormParam = {
  data: iVac1
  submitData: (method: string, p: iVac1) => void
}

export const initData: iVac1 = {
  id: 0,
  uuid: '',
  name: '',
  nik: '',
  birthDate: moment(new Date()).format('YYYY-MM-DD'),
  firstDate: moment(new Date()).format('YYYY-MM-DD'),
  nextDate: moment(new Date()).format('YYYY-MM-DD'),
  vacType: 'CoronaVac',
  firstBatch: '',
  nextBatch: '',
  firstQr: '',
  nextQr: '',
  isSelected: true,
}

const initialVacType: VacType = {
  id: "Sinovac",
  name: "Sinovac"
} 

const Vac1Form: NextPage<vac1FormParam> = ({ data: people, submitData }) => {
  const [data, setData] = React.useState<iVac1>(initData)
  const [oldId, setOldId] = React.useState<number>()
  const [submitOption, setSubmitOption] = React.useState('cancel')
  const dialog = useDialogContainer()

  const isNameValid = React.useMemo(() => data && data.name && data.name.length > 0, [data])
  const isCodeValid = React.useMemo(() => data && data.uuid && data.uuid?.length > 0, [data])
  const isTypeValid = React.useMemo(() => data && data.vacType.length > 0, [data])
  const isBatchValid = React.useMemo(() => data && data.firstBatch.length > 0, [data])
  const isNextBatchValid = React.useMemo(() => data && data.nextBatch.length > 0, [data])
  const isNikValid = React.useMemo(() => data && data.nik.length > 0, [data])
  const isFirstQrValid = React.useMemo(() => data && data.nik.length > 0, [data])
  const isNextQrValid = React.useMemo(() => data && data.nik.length > 0, [data])

  let options: VacType[] = [
    { id: 'Astra Zeneca', name: 'Astra Zeneca' },
    { id: 'CoronaVac', name: 'CoronaVac' },
    { id: 'Pfizer', name: 'Pfizer' },
    { id: 'Moderna', name: 'Moderna' },
    { id: 'Sinovac', name: 'Sinovac' },
  ]
  
  let [fucksin, setFucksin] = React.useState<VacType>(options.filter(o=>o.id === people.vacType)[0] || initialVacType)

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

  const handleChange = (name: string, value: string) => {
    const test = { ...data, [name]: value }
    setData((o) => ({ ...o, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    submitData(submitOption, {...data, vacType: fucksin.id})
  }

  return (
    <Dialog>
      <Heading>{data.id > 0 ? data.name : 'New people'}</Heading>
      <Divider size="S" />

      <Content>
        <Form onSubmit={handleSubmit} width="100%">
          <Flex direction="column" gap="size-200">
            <Flex direction={{ base: 'column', M: 'row' }} gap="size-200">
              <TextField
                width={{ base: '100%', M: '50%' }}
                label="Name"
                autoFocus
                placeholder="e.g Doni Aramadi"
                onChange={(e) => handleChange('name', e)}
                value={data.name}
              />
              <TextField
                label="UUID"
                width={{ base: '100%', M: '50%' }}
                placeholder="e.g f5s65jh6rt9x8ff93y57dd"
                onChange={(e) => handleChange('uuid', e)}
                value={data.uuid}
              />
            </Flex>
            <Flex direction={{ base: 'column', M: 'row' }} gap="size-200">
              <TextField
                label="NIK"
                placeholder="e.g 1234547987985465"
                type="text"
                width={{ base: '100%', M: '50%' }}
                onChange={(e) => handleChange('nik', e)}
                value={data.nik}
              />
              <TextField
                label="Birth Date"
                type="date"
                width={{ base: '100%', M: '50%' }}
                onChange={(e) => handleChange('birthDate', e)}
                value={moment(data.birthDate).format('YYYY-MM-DD')}
              />
            </Flex>
            <ComboBox
              label="Fucksin Type"
              width={{ base: '100%' }}
              placeholder="e.g Moderna"
              onSelectionChange={(e) => {
                let test = options.filter((o) => o.id === e)[0];
                if(test){
                  setFucksin(test)
                }
              }}
              defaultSelectedKey={fucksin.id}
              defaultItems={options}
            >
              {(item) => <Item textValue={item.id}>{item.name}</Item>}
            </ComboBox>
            <Flex direction={{ base: 'column', M: 'row' }} gap="size-200">
              <TextField
                label="First Date Fucksin"
                type="date"
                width={{ base: '100%', M: '50%' }}
                onChange={(e) => handleChange('firstDate', e)}
                value={moment(data.firstDate).format('YYYY-MM-DD')}
              />
              <TextField
                width={{ base: '100%', M: '50%' }}
                label="First Batch"
                placeholder="e.g 123656487"
                onChange={(e) => handleChange('firstBatch', e)}
                value={data.firstBatch}
              />
            </Flex>
            <Flex direction={{ base: 'column', M: 'row' }} gap="size-200">
              <TextField
                width={{ base: '100%', M: '50%' }}
                label="First QR"
                placeholder="e.g Q-125TY15FF"
                onChange={(e) => handleChange('firstQr', e)}
                value={data.firstQr}
              />
              <TextField
                width={{ base: '100%', M: '50%' }}
                label="Next Date Fucksin"
                type="date"
                onChange={(e) => handleChange('nextDate', e)}
                value={moment(data.nextDate).format('YYYY-MM-DD')}
              />
            </Flex>
            <Flex direction={{ base: 'column', M: 'row' }} gap="size-200">
              <TextField
                width={{ base: '100%', M: '50%' }}
                label="Next Batch"
                placeholder="e.g 32654974"
                onChange={(e) => handleChange('nextBatch', e)}
                value={data.nextBatch}
              />
              <TextField
                width={{ base: '100%', M: '50%' }}
                label="Next QR"
                placeholder="e.g P-125TY15FF"
                onChange={(e) => handleChange('nextQr', e.toUpperCase())}
                value={data.nextQr}
              />
            </Flex>
          </Flex>
          <ButtonGroup marginTop="size-200">
            <Flex direction="row" flex>
              <View flex>
                <Button
                  marginEnd="size-100"
                  onPress={() => {
                    dialog.dismiss()
                    setSubmitOption(oldId ? 'put' : 'post')
                  }}
                  type="submit"
                  variant="cta"
                >
                  <SaveIcon />
                  <Text>Save</Text>
                </Button>
                <Button isHidden={{base:true,M:false}} variant="secondary" type="button" onPress={() => dialog.dismiss()}>
                  Cancel
                </Button>
              </View>
                <Button
                  variant="negative"
                  onPress={() => {
                    dialog.dismiss()
                    setSubmitOption('delete')
                  }}
                  type="submit"
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

export default Vac1Form
