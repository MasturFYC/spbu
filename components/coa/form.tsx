import React, { FormEvent } from 'react'
import {
  Flex,
  Button,
  ProgressCircle,
  Form,
  TextField,
  NumberField,
  TextArea,
  ComboBox,
  useDialogContainer,
  Item,
  ButtonGroup,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  Content,
  Dialog,
  Divider,
  Heading,
  View,
} from '@adobe/react-spectrum'
import { AsyncListData } from '@react-stately/data'
import { iCoa, iCoaParent, linkableCoa, postableCoa } from '../interfaces'
import { initCoa } from '../../lib/use-coa'
import { checkParent } from './list'

type coaFormParam = {
  coa: iCoa
  onCOAChange?: (p: iCoa) => void
  onDelete: () => void
  children: JSX.Element
  coaParent: AsyncListData<iCoaParent>
}
export function CoaForm(params: coaFormParam) {
  const dialog = useDialogContainer()
  const { coaParent, coa, onCOAChange, children, onDelete } = params
  const [curCoa, setCurCoa] = React.useState<iCoa>(initCoa)

  React.useEffect(() => {
    let isLoaded = false

    if (!isLoaded) {
      setCurCoa(coa)
    }

    return () => {
      isLoaded = true
    }
  }, [coa])

  if (coaParent.isLoading) {
    return (
      <Flex alignItems="center" alignSelf="center" justifyContent="center">
        <ProgressCircle aria-label="Loading…" isIndeterminate />
      </Flex>
    )
  }

  //console.log(coaList);
  const onChange = (
    label: string,
    value: string | string[] | number | linkableCoa | postableCoa
  ) => {
    setCurCoa((o) => ({ ...o, [label]: value }))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    onCOAChange && onCOAChange(curCoa)
  }

  const onComboChange = (e: React.Key) => {
    onChange('parentId', e)

    //console.log(e);
  }

  const onTypeChange = (typeId: string) => {
    //console.log(typeId);
    onChange('coaTypeId', +typeId)
  }
  return (
    <Dialog
      height={'auto'}
      minWidth="320px"
      maxWidth={'size-6000'}
      width="size-5000">
      <Heading marginX="-1rem" marginY="-1rem">
        {coa.name}
      </Heading>
      <Divider marginX="-1rem" width="calc(100% + 2rem)" />
      <Content margin="-1rem">
        <Form onSubmit={onSubmit}>
          <div className="flex flex-row">
            <Checkbox
              isSelected={curCoa.postable === postableCoa.POSTABLE}
              onChange={(e) =>
                onChange(
                  'postable',
                  e ? postableCoa.POSTABLE : postableCoa.NONE
                )
              }>
              Postable
            </Checkbox>
            <Checkbox
              isSelected={curCoa.linkable === linkableCoa.LINKABLE}
              onChange={(e) =>
                onChange(
                  'linkable',
                  e ? linkableCoa.LINKABLE : linkableCoa.NONE
                )
              }>
              Linked
            </Checkbox>
          </div>

          <Flex
            flex
            direction={{ base: 'row', M: 'row', L: 'row' }}
            maxWidth={{ base: '100%', M: 'auto', L: 'auto' }}
            wrap
            gap="size-100">
            <NumberField
              isDisabled={curCoa.id > 0}
              formatOptions={{
                useGrouping: false,
              }}
              maxValue={9999}
              maxWidth="size-800"
              label="Kode Akun"
              hideStepper
              value={curCoa.code}
              onChange={(e) => onChange('code', +e)}
            />
            <TextField
              flex
              width="auto"
              label="Nama Akun"
              placeholder={'e.g Persediaan Pertamax'}
              value={curCoa.name}
              onChange={(e) => onChange('name', e)}
            />
          </Flex>
          <ComboBox
            flex
            isDisabled={curCoa.id > 0}
            label="Akun Induk"
            items={coaParent.items.filter((o) =>
              checkParent(o.code, curCoa.code)
            )}
            selectedKey={curCoa.parentId}
            onSelectionChange={onComboChange}
            placeholder={'e.g. Pilih salah satu akun induk'}>
            {(item) => <Item>{item.id === 0 ? 'none' : item.name}</Item>}
          </ComboBox>
          <TextArea
            flex
            minHeight="size-1600"
            label="Keterangan"
            value={curCoa.description || ''}
            onChange={(e) => onChange('description', e)}
          />
          <ButtonGroup marginTop="size-200" flex>
            <Flex direction="row" gap="size-100" flex>
              <View flex>
                <Button
                  variant={'negative'}
                  isDisabled={curCoa.id === 0}
                  onPress={() => {
                    onDelete()
                    dialog.dismiss()
                  }}>
                  Hapus
                </Button>
              </View>
              <View>
                <Button
                  variant="secondary"
                  onPress={() => dialog.dismiss()}
                  marginEnd="size-100">
                  Batal
                </Button>
                <Button
                  type="submit"
                  // isDisabled={!dirty}
                  variant="cta">
                  Simpan
                </Button>
              </View>
            </Flex>
          </ButtonGroup>
        </Form>
        {children}
      </Content>
    </Dialog>
  )
}
