import React, { FormEvent } from 'react'
import { iProduct, iSpbu } from '../interfaces'
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
  Checkbox,
  View,
  Picker,
  Item,
} from '@adobe/react-spectrum'
import { checkParent } from '../coa/list'

export function ProductForm({
  product: p,
  updateList,
  productList,
  onDelete,
  spbus,
}: {
  product: iProduct
  updateList: (p: iProduct) => void
  onDelete: Function
  productList: iProduct[]
  spbus: iSpbu[]
}): JSX.Element {
  const dialog = useDialogContainer()
  const [product, setProduct] = React.useState<iProduct>({} as iProduct)
  const [dirty, setDirty] = React.useState<boolean>(false)
  const isSalePriceValid = React.useMemo(
    () => product.salePrice > product.buyPrice,
    [product]
  )
  const isNameValid = React.useMemo(
    () => product && product.name && product.name.length > 0,
    [product]
  )
  const isCodeValid = React.useMemo(
    () => product && product.code > 0,
    [product]
  )
  const isUnitValid = React.useMemo(
    () => product && product.unit && product.unit.length > 0,
    [product]
  )

  React.useEffect(() => {
    let isLoaded = false

    if (!isLoaded) {
      setProduct({ ...p })
    }

    return () => {
      isLoaded = true
    }
  }, [p])

  const handleChange = (name: string, value: number | boolean | string) => {
    const test = { ...product, [name]: value }
    setProduct((o) => ({ ...o, [name]: value }))

    if (test.beSold) {
      setDirty(
        test.code !== 0 &&
          test.name !== '' &&
          test.unit !== '' &&
          test.buyPrice !== 0 &&
          test.salePrice !== 0 &&
          test.salePrice > test.buyPrice
      )
    } else {
      setDirty(test.code !== 0 && test.name !== '' && test.unit !== '')
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    updateList(product)
  }

  return (
    <Dialog height={'auto'} flex width="auto">
      <Heading marginX="-1rem" marginY="-1rem">
        {0 === +product.id ? 'New Product' : product.name}
      </Heading>
      <Divider marginX="-1rem" width="calc(100% + 2rem)" />
      <Content margin="-1rem">
        <Form
          justifySelf="center"
          alignSelf="center"
          aria-label="Quiet example"
          onSubmit={handleSubmit}>
          <Flex direction={'column'} gap="size-50">
            <Checkbox
              isEmphasized
              defaultSelected
              isSelected={product.beSold}
              onChange={(e) => handleChange('beSold', e)}>
              Product ini bisa dijual
            </Checkbox>

            <View>
              <Flex
                direction={{ base: 'column', L: 'row', M: 'row' }}
                gap="size-100">
                <Picker
                  validationState={product.spbuId > 0 ? 'valid' : 'invalid'}
                  aria-label="spbu-id"
                  autoFocus
                  flex
                  width="100%"
                  items={spbus}
                  placeholder="e.g. pilih SPBU"
                  label="SPBU"
                  selectedKey={'' + product.spbuId}
                  onSelectionChange={(e) => handleChange('spbuId', +e)}>
                  {(item) => <Item key={item.id}>{item.name}</Item>}
                </Picker>
                <Picker
                  aria-label="parent-id"
                  flex
                  width="100%"
                  items={productList.filter((o) =>
                    checkParent(
                      product.id === 0 ? 0 : o.code,
                      product.code || 0
                    )
                  )}
                  placeholder="e.g. nama produk induk "
                  label="Produk Induk"
                  selectedKey={'' + product.parentId}
                  onSelectionChange={(e) => handleChange('parentId', +e)}>
                  {(item) => (
                    <Item key={item.id}>
                      {item.id === 0
                        ? 'none'
                        : `${item.parentCode} - ${item.name}`}
                    </Item>
                  )}
                </Picker>
              </Flex>
            </View>
            <View>
              <Flex direction="row" gap="size-100">
                <NumberField
                  formatOptions={{
                    useGrouping: false,
                  }}
                  validationState={product.code > 0 ? 'valid' : 'invalid'}
                  label={'No. Akun'}
                  minValue={1}
                  maxValue={9999}
                  isRequired
                  minWidth="size-1000"
                  maxWidth="size-1200"
                  hideStepper
                  value={product.code}
                  onChange={(e) => handleChange('code', +e)}
                />
                <TextField
                  validationState={isNameValid ? 'valid' : 'invalid'}
                  flex
                  isRequired
                  width="auto"
                  maxLength={50}
                  placeholder="e.g. Pertamax Turbo"
                  label={'Nama'}
                  value={product.name}
                  onChange={(e) => handleChange('name', e)}
                />
              </Flex>
            </View>
            <View>
              <Flex direction="row" width="auto" gap="size-100" flex wrap>
                <TextField
                  validationState={
                    product.barcode && product.barcode.length > 0
                      ? 'valid'
                      : 'invalid'
                  }
                  flex
                  isRequired
                  width="auto"
                  maxLength={50}
                  placeholder="e.g. 084154888880"
                  label={'Barcode'}
                  value={product.barcode}
                  onChange={(e) => handleChange('barcode', e)}
                />
                <TextField
                  validationState={isUnitValid ? 'valid' : 'invalid'}
                  label={'Unit'}
                  width="size-1000"
                  isRequired
                  maxLength={6}
                  placeholder="e.g. Lt"
                  value={product.unit}
                  onChange={(e) => handleChange('unit', e)}
                />
              </Flex>
            </View>
            <Flex direction="row" width="auto" gap="size-100" flex wrap>
              <NumberField
                validationState={product.content >= 1 ? 'valid' : 'invalid'}
                label={'Isi'}
                width="size-1000"
                isRequired
                flex
                hideStepper
                value={product.content}
                onChange={(e) => handleChange('content', +e)}
              />
              <NumberField
                formatOptions={{
                  useGrouping: false,
                }}
                validationState={product.firstStock >= 0 ? 'valid' : 'invalid'}
                label={'Stock Awal'}
                minValue={0}
                isRequired
                flex
                hideStepper
                value={product.firstStock}
                onChange={(e) => handleChange('firstStock', +e)}
              />

              <NumberField
                label={'Octan'}
                width="size-1000"
                hideStepper
                flex
                value={product.octan}
                onChange={(e) => handleChange('octan', e)}
              />
            </Flex>
            <Flex direction="row" width="auto" gap="size-100" flex wrap>
              <NumberField
                flex
                label={'Harga DO'}
                hideStepper
                isRequired
                width="auto"
                value={product.buyPrice}
                onChange={(e) => handleChange('buyPrice', e)}
              />
              <NumberField
                validationState={
                  product.beSold
                    ? isSalePriceValid
                      ? 'valid'
                      : 'invalid'
                    : 'valid'
                }
                label={'Harga POMP'}
                flex
                hideStepper
                width="auto"
                isRequired
                value={product.salePrice}
                onChange={(e) => handleChange('salePrice', e)}
              />
            </Flex>
            <View>
              <TextArea
                flex
                label={'Keterangan'}
                width="100%"
                minHeight={'size-1200'}
                maxLength={256}
                value={(product.description && product.description) || ''}
                onChange={(e) => handleChange('description', e)}
              />
            </View>
            <ButtonGroup flex marginTop="size-200">
              <Flex direction="row" gap="size-100" flex>
                <View flex>
                  <Button
                    variant={'negative'}
                    isDisabled={product.id === 0}
                    onPress={() => onDelete()}>
                    Hapus
                  </Button>
                </View>
                <View>
                  <Button
                    variant="secondary"
                    marginEnd="size-100"
                    onPress={() => dialog.dismiss()}>
                    Batal
                  </Button>
                  <Button type="submit" isDisabled={!dirty} variant="cta">
                    Simpan
                  </Button>
                </View>
              </Flex>
            </ButtonGroup>
          </Flex> 
        </Form>
      </Content>
    </Dialog>
  )
}
