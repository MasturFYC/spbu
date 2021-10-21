import React, { FormEvent } from 'react';
import { iEmployee, iSpbu } from '../interfaces';
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
  TextArea,
  ButtonGroup,
  Button,
  Picker,
  Item,
  View,
} from '@adobe/react-spectrum';
import { useSpbu } from '@lib/use-spbu';

export function EmployeeForm({
  employee: p,
  updateList,
  onDelete,
}: {
  employee: iEmployee;
  updateList: (p: iEmployee) => void;
  onDelete: Function;
}): JSX.Element {
  let spbu = useSpbu();
  const dialog = useDialogContainer();
  const [employee, setEmployee] = React.useState<iEmployee>({} as iEmployee);
  const [dirty, setDirty] = React.useState<boolean>(false);
  const isBpjsKesehatanValid = React.useMemo(
    () => employee.bpjsKesehatan >= 0,
    [employee]
  );
  const isBpjsKerjaValid = React.useMemo(
    () => employee.bpjsKerja >= 0,
    [employee]
  );
  const isSalaryValid = React.useMemo(() => employee.salary >= 0, [employee]);
  const isAllowanceValid = React.useMemo(
    () => employee.allowance >= 0,
    [employee]
  );

  const roles = [
    { id: 0, name: 'none' },
    { id: 1, name: 'Owner' },
    { id: 2, name: 'Admin' },
    { id: 3, name: 'Supervisor' },
    { id: 4, name: 'Operator' },
  ];

  React.useEffect(() => {
    let isLoaded = false;

    if (!isLoaded) {
      setEmployee({ ...p });
    }

    return () => {
      isLoaded = true;
    };
  }, [p]);

  const handleChange = (name: string, value: number | string) => {
    const test = { ...employee, [name]: value };
    setEmployee((o) => ({ ...o, [name]: value }));
    setDirty(
      // test.name !== '' &&
      test.role !== ''
    );
    //console.log(test);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateList(employee);
  };

  return (
    <Dialog height={'auto'} maxWidth={'size-6000'} width="auto">
      <Heading marginX="-1rem" marginY="-1rem">
        {employee.name}
      </Heading>
      <Divider marginX="-1rem" width="calc(100% + 2rem)" />
      <Content margin="-1rem">
        <Form
          justifySelf="center"
          aria-label="Quiet example"
          onSubmit={handleSubmit}>
          <Flex direction="column" gap="size-50" flex wrap>
            <Flex direction="row" width="auto" gap="size-200" flex wrap>
              <TextField
                flex
                isDisabled
                width="auto"
                label={'Nama'}
                defaultValue={employee.name}
              />
              <TextField
                label={'Email'}
                isReadOnly
                isDisabled
                flex
                width="auto"
                defaultValue={employee.email}
              />
            </Flex>
            <Flex direction="row" width="auto" gap="size-200" wrap>
              <Picker
                flex
                id="role-id"
                autoFocus
                label="Role"
                selectedKey={employee.role}
                onSelectionChange={(e) => handleChange('role', e)}>
                {roles.map((o) => (
                  <Item key={o.name}>{o.name}</Item>
                ))}
              </Picker>
              <Picker
                flex
                id="spbu-id"
                label="Lokasi SPBU"
                selectedKey={'' + employee.spbuId}
                onSelectionChange={(e) => handleChange('spbuId', +e)}>
                {spbu.items.map((o) => <Item key={o.id}>{`${o.code}${o.name && ` - ${o.name}`}`}</Item>)}
              </Picker>
            </Flex>

            <Flex direction="row" width="auto" gap="size-200" flex wrap>
              <NumberField
                validationState={isSalaryValid ? 'valid' : 'invalid'}
                label={'Gaji Pokok'}
                hideStepper
                width="size-1000"
                flex
                value={employee.salary}
                onChange={(e) => handleChange('salary', +e)}
              />
              <NumberField
                validationState={isAllowanceValid ? 'valid' : 'invalid'}
                label={'Tunjangan'}
                width="size-1000"
                hideStepper
                flex
                value={employee.allowance}
                onChange={(e) => handleChange('allowance', +e)}
              />
            </Flex>
            <Flex direction="row" width="auto" gap="size-200" flex wrap>
              <NumberField
                validationState={isBpjsKesehatanValid ? 'valid' : 'invalid'}
                label={'BPJS Kesehatan'}
                hideStepper
                width="size-1000"
                flex
                value={employee.bpjsKesehatan}
                onChange={(e) => handleChange('bpjsKesehatan', +e)}
              />
              <NumberField
                validationState={isBpjsKerjaValid ? 'valid' : 'invalid'}
                label={'BPJS Ketenagakerjaan'}
                width="size-1000"
                hideStepper
                flex
                value={employee.bpjsKerja}
                onChange={(e) => handleChange('bpjsKerja', +e)}
              />
            </Flex>
            <TextArea
              flex
              label={'Alamat'}
              width="auto"
              height={'size-1200'}
              maxLength={256}
              value={employee?.street || ''}
              onChange={(e) => handleChange('street', e)}
            />
            <Flex
              direction="row"
              width="auto"
              gap="size-200"
              flex
              wrap
              marginBottom="size-125">
              <TextField
                flex
                label={'Kota'}
                width="auto"
                height={'size-1500'}
                maxLength={256}
                value={employee?.city || ''}
                onChange={(e) => handleChange('city', e)}
              />
              <TextField
                flex
                label={'Telephone'}
                width="size-160"
                height={'size-1500'}
                maxLength={256}
                value={employee?.phone || ''}
                onChange={(e) => handleChange('phone', e)}
              />
            </Flex>
          </Flex>
          <ButtonGroup marginTop="size-200" flex>
            <Flex direction="row" gap="size-100" flex>
              <View flex>
                <Button
                  variant={'negative'}
                  isDisabled={employee.id === 0}
                  onPress={() => onDelete()}>
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
                <Button type="submit" isDisabled={!dirty} variant="cta">
                  Simpan
                </Button>
              </View>
            </Flex>
          </ButtonGroup>
        </Form>
      </Content>
    </Dialog>
  );
}
