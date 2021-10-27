import React, { FormEvent, useState } from 'react'
import { iVaccin, VacType } from '@components/interfaces'
import { TextField, Text, Flex, View, TextArea, Button } from '@adobe/react-spectrum'
import { Dialog, useDialogContainer } from '@react-spectrum/dialog'
import { Content } from '@react-spectrum/view'
import { Heading } from '@react-spectrum/text'
import { Form } from '@react-spectrum/form'
import { Divider } from '@react-spectrum/divider'
import { ComboBox, Item } from '@react-spectrum/combobox'
import { ButtonGroup } from '@react-spectrum/buttongroup'
import SaveIcon from '@spectrum-icons/workflow/SaveFloppy'

const initialVacType: VacType = {
  id: 'Sinovac',
  name: 'Sinovac',
}

export const initialVaccin: iVaccin = {
  vac2Id: 0,
  id: 0,
  createdAt: '',
  vacType: initialVacType.id,
  batch: '',
  vacLocation: '',
  description: '',
  isNew: true,
  isChanged: false,
  isSelected: false,
}

const options: VacType[] = [
  { id: 'Astra Zeneca', name: 'Astra Zeneca' },
  { id: 'CoronaVac', name: 'CoronaVac' },
  { id: 'Pfizer', name: 'Pfizer' },
  { id: 'Moderna', name: 'Moderna' },
  { id: 'Sinovac', name: 'Sinovac' },
]

export default function SubForm({
  item,
  submitData,
}: {
  item: iVaccin
  submitData: (method: string, e: iVaccin) => void
}) {
  const [data, setData] = useState<iVaccin>(initialVaccin)
  const [submitOption, setSubmitOption] = React.useState('cancel')
  const dialog = useDialogContainer()
  let [fucksin, setFucksin] = React.useState<VacType>(
    options.filter((o) => o.id === item.vacType)[0] || initialVacType
  )

  React.useEffect(() => {
    let isLoaded = false

    if (!isLoaded) {
      setData(item)
    }
    return () => {
      isLoaded = false
    }
  }, [item])

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
      <Heading>{data.id > 0 ? data.vacType : 'New Fucksin'}</Heading>
      <Divider size="S" />

      <Content>
        <Form onSubmit={handleSubmit}>
          <Flex direction="column" rowGap="size-200">
            <Flex direction={{ base: 'column', M: 'row' }} gap="size-200">
              <TextField
                label="On Date"
                autoFocus
                width={{ base: '100%', M: '50%' }}
                value={data.createdAt}
                onChange={(e) => handleChange('createdAt', e)}
              />
              <ComboBox
                label="Fucksin Type"
                width={{ base: '100%', M: '50%' }}
                placeholder="e.g Moderna"
                onSelectionChange={(e) => {
                  let test = options.filter((o) => o.id === e)[0]
                  if (test) {
                    setFucksin(test)
                  }
                }}
                defaultSelectedKey={fucksin.id}
                defaultItems={options}
              >
                {(item) => <Item textValue={item.id}>{item.name}</Item>}
              </ComboBox>
            </Flex>
            <Flex direction={{ base: 'column', M: 'row' }} gap="size-200">
              <TextField
                label="Batch"
                width={{ base: '100%', M: '50%' }}
                value={data.batch}
                onChange={(e) => handleChange('batch', e)}
              />
              <TextField
                width={{ base: '100%', M: '50%' }}
                label="Location"
                value={data.vacLocation}
                onChange={(e) => handleChange('vacLocation', e)}
              />
            </Flex>
            <TextField
              width='100%'
              label="Description"
              value={data.description}
              onChange={(e) => handleChange('description', e)}
            />
          </Flex>
          <ButtonGroup marginTop="size-200">
              <Flex direction="row" flex>
                <View flex>
                  <Button
                    marginEnd="size-100"
                    variant="cta"
                    onPress={() => {
                      setSubmitOption(data.isNew ? 'post' : 'put')
                      dialog.dismiss()
                    }}
                    type="submit"
                  >
                    <SaveIcon/>
                    <Text>Save</Text>
                  </Button>
                  <Button isHidden={{base:true,M:false}} variant="secondary" onPress={() => dialog.dismiss()}>
                    Cancel
                  </Button>
                </View>
                <View>
                  <Button
                    variant="negative"
                    onPress={(e) => {
                      setSubmitOption('delete')
                      dialog.dismiss()
                    }}
                    isDisabled={data.id > 0 ? false : true}
                    type="submit"
                  >
                    Delete
                  </Button>
                </View>
              </Flex>
            </ButtonGroup>
        </Form>
      </Content>
    </Dialog>
  )
}
