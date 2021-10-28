import React, { FormEvent } from 'react'
import { iSpbu } from '../interfaces'
import {
  useDialogContainer,
  Dialog,
  Heading,
  Divider,
  Content,
  Form,
  TextField,
  Flex,
  NumberField,
  Footer,
  TextArea,
  ButtonGroup,
  Button,
  Picker,
  Item,
  View,
} from '@adobe/react-spectrum'

type spbuFormProps = {
  spbu: iSpbu
  updateList: (p: iSpbu) => void
  onDelete: Function
}

export function SpbuForm({ spbu: p, updateList, onDelete }: spbuFormProps): JSX.Element {
  const dialog = useDialogContainer()
  const [spbu, setSpbu] = React.useState<iSpbu>({} as iSpbu)
  const [dirty, setDirty] = React.useState<boolean>(false)
  const isNameValid = React.useMemo(() => spbu && spbu.name && spbu.name.length > 0, [spbu])
  const isCodeValid = React.useMemo(() => spbu && spbu.code && spbu.code.length > 0, [spbu])

  React.useEffect(() => {
    let isLoaded = false

    if (!isLoaded) {
      setSpbu({ ...p })
    }

    return () => {
      isLoaded = true
    }
  }, [p])

  const handleChange = (name: string, value: number | string) => {
    const test = { ...spbu, [name]: value }
    setSpbu((o) => ({ ...o, [name]: value }))
    setDirty(
      // test.name !== '' &&
      test.name !== '' && test.code !== ''
    )
    //console.log(test);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    updateList(spbu)
  }

  return (
    <Dialog size="M">
      <Heading>{0 === +spbu.id ? 'New SPBU' : spbu.name}</Heading>
      <Divider />
      <Content>
        <Form justifySelf="center" aria-label="Form SPBU" onSubmit={handleSubmit}>
          <Flex direction="column" gap="size-200">
            <Flex direction={{ base: 'column', M: 'row' }} gap="size-200">
              <TextField
                width="auto"
                value={spbu.name}
                autoFocus
                validationState={isNameValid ? 'valid' : 'invalid'}
                label={'Nama'}
                placeholder="e.g. Sekar Mulya"
                maxLength={50}
                onChange={(e) => handleChange('name', e)}
              />
              <TextField
                width="auto"
                value={spbu.code}
                placeholder="e.g. 34-45240"
                validationState={isCodeValid ? 'valid' : 'invalid'}
                label={'code'}
                maxLength={25}
                onChange={(e) => handleChange('code', e)}
              />
            </Flex>
            <TextArea
              label={'Alamat'}
              placeholder="Jl. Jend. Sudirman No. 11 Blok A-4 Kel. Lemah Mekar"
              width="auto"
              height={'size-1500'}
              maxLength={256}
              value={spbu?.street || ''}
              onChange={(e) => handleChange('street', e)}
            />
            <Flex direction={{ base: 'column', M: 'row' }} gap="size-200">
              <TextField
                placeholder="e.g. Indramayu"
                label={'Kota'}
                width={{base:"auto", M:"50%"}}
                maxLength={256}
                value={spbu?.city || ''}
                onChange={(e) => handleChange('city', e)}
              />
              <TextField
                label={'Telephone'}
                placeholder="e.g. 085321703564"
                width={{base:"auto", M:"50%"}}
                maxLength={256}
                value={spbu?.phone || ''}
                onChange={(e) => handleChange('phone', e)}
              />
            </Flex>
          </Flex>
          <ButtonGroup marginTop="size-200" flex>
            <Flex direction="row" gap="size-100" flex>
              <View flex>
              <Button type="submit" isDisabled={!dirty} variant="cta">
                  Simpan
                </Button>
              <Button isHidden={{base: true, M: false}} variant="secondary" onPress={() => dialog.dismiss()} marginStart="size-100">
                  Batal
                </Button>
              </View>
              <View>
              <Button variant={'negative'} isDisabled={spbu.id === 0} onPress={() => onDelete()}>
                  Hapus
                </Button>
              </View>
            </Flex>
          </ButtonGroup>
        </Form>
      </Content>
    </Dialog>
  )
}
