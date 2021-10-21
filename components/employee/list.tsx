import React from 'react';
import {
  Flex,
  View,
  DialogContainer,
  SearchField,
  ProgressCircle,
  Link,
} from '@adobe/react-spectrum';
import User from '@spectrum-icons/workflow/User';
import Phone from '@spectrum-icons/workflow/DevicePhone';
import Address from '@spectrum-icons/workflow/Location';
import LocationContribution from '@spectrum-icons/workflow/LocationContribution';
import Email from '@spectrum-icons/workflow/Email';
import WorkDate from '@spectrum-icons/workflow/Date';
import LinkUser from '@spectrum-icons/workflow/LinkUser';
import Salary from '@spectrum-icons/workflow/Money';
import Allowance from '@spectrum-icons/workflow/CreditCard';
import { iEmployee } from '../interfaces';
import { useEmployee } from '../../lib/use-employee';
import { EmployeeForm } from './form';
import { FormatDate, FormatNumber } from '../../lib/format';
import ImageUploader from './imageUploader';

const defaultUrl = '/api/employee';

const title = 'Employee List';
const initEmployee: iEmployee = {
  id: 0,
  name: '',
  email: '',
  password: '',
  role: '',
  spbuId: 0,
  salary: 0,
  allowance: 0,
  startAt: Date().toString(),
  bpjsKesehatan: 0,
  bpjsKerja: 0,
};

const EmployeeList = ({ role }: { role?: string }) => {
  const { employees, mutateEmployee, error, isLoading } = useEmployee();
  const [employee, setEmployee] = React.useState<iEmployee>({} as iEmployee);
  const [open, setOpen] = React.useState(false);
  const [txtSearch, setTxtSearch] = React.useState<string>('');

  if (isLoading)
    return (
      <Flex alignItems="center" justifyContent="center">
        <ProgressCircle aria-label="Loading…" isIndeterminate />
      </Flex>
    );

  const searchEmployee = async () => {
    const url = `/api/employee/search/${txtSearch}`;
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    };

    await fetch(url, fetchOptions)
      .then(async (response) => {
        if (response.ok) {
          return response.json().then((data) => data);
        }
        return response.json().then((error) => {
          mutateEmployee([], false);
          return Promise.reject(error);
        });
      })
      .then((data) => {
        mutateEmployee(data, false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateData = async (method: string, id: number, p: iEmployee) => {
    const url = `${defaultUrl}/${id}`;
    const fetchOptions = {
      method: method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(p),
    };

    const res = await fetch(url, fetchOptions);
    const data: iEmployee | any = await res.json();

    if (res.status === 200) {
      mutateEmployee(employees, true);
      setOpen(false);
    }
  };

  const handleSubmit = (e: iEmployee) => {
    updateData(e.id === 0 ? 'POST' : 'PUT', e.id, e);
  };

  const deleteData = async () => {
    const url = `${defaultUrl}/${employee.id}`;
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    };

    const res = await fetch(url, fetchOptions);
    const data: iEmployee | any = await res.json();

    if (res.status === 200) {
      setOpen(false);
      mutateEmployee(employees, true);
    } else {
      console.log('Employee cannot be removed!');
    }
  };

  const uploadImage = async (id: number, file: string) => {
    //console.log('------', id, file)
    const url = `${defaultUrl}/${id}`;
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        file: file,
      }),
    };

    const res = await fetch(url, fetchOptions);
    const data: iEmployee | any = await res.json();

    if (res.status === 200) {
      //setOpen(false);
      mutateEmployee(employees, true);
    } else {
      console.log('Photo tidak bisa diupload!');
    }
  };

  const onNameClick = (p: iEmployee) => {
    setEmployee(p);
    setOpen(true);
  };

  return (
    <React.Fragment>
      <DialogContainer
        type={'modal'}
        onDismiss={() => setOpen(false)}
        isDismissable>
        {open && (
          <EmployeeForm
            employee={employee}
            onDelete={deleteData}
            updateList={handleSubmit}
          />
        )}
      </DialogContainer>
      <View marginX="size-100" width="auto" marginTop="size-300">
        <Flex justifyContent="center" marginBottom="size-200">
          <SearchField
            placeholder="e.g. Doni"
            width="auto"
            marginBottom="size-300"
            aria-label="Search employee"
            justifySelf="center"
            maxWidth="size-3600"
            value={txtSearch}
            icon={<User />}
            onClear={() => mutateEmployee(employees, true)}
            onChange={(e) => setTxtSearch(e)}
            onSubmit={() => searchEmployee()}
          />
        </Flex>
        {employees && (
          <Flex
            flex
            direction={'row'}
            gap="size-100"
            wrap
            marginBottom="size-500"
            justifyContent="center">
            {employees.map((p) => (
              <View
                flex
                key={`pid-${p.id}`}
                height="auto"
                borderColor="mid"
                borderWidth="thin"
                padding="size-125"
                backgroundColor="gray-50"
                width={'auto'}
                minWidth={'340px'}
                maxWidth={'320px'}
                borderRadius="medium">
                <Flex direction={'row'} gap="size-200">
                  <View maxWidth="140px">
                    <ImageUploader
                      role={role}
                      photo={p.photo}
                      empId={p.id}
                      uploadImage={uploadImage}
                    />
                  </View>
                  <View maxWidth="auto" flex>
                    <View marginBottom="size-200">
                      {role === 'Admin' || role === 'Owner' ? (
                        <Link isQuiet onPress={() => onNameClick(p)}>
                          <strong>
                            <User
                              size="S"
                              marginBottom="-0.3rem"
                              marginEnd="size-130"
                            />
                            {p.name}
                          </strong>
                        </Link>
                      ) : (
                        <span>
                          <User
                            size="S"
                            marginBottom="-0.3rem"
                            marginEnd="size-130"
                          />
                          {p.name}
                        </span>
                      )}
                    </View>
                    <View marginBottom="size-100">
                      <LinkUser
                        size="S"
                        marginBottom="-0.3rem"
                        marginEnd="size-130"
                      />
                      {p.role}
                    </View>
                    <View marginBottom="size-100">
                      <WorkDate
                        color={p.spbuId > 0 ? 'positive' : 'negative'}
                        size="S"
                        marginBottom="-0.3rem"
                        marginEnd="size-130"
                      />
                      {FormatDate(p.startAt)}
                      {p.spbuId > 0 && (
                        <span>
                          <br />
                          <LocationContribution
                            size="S"
                            marginBottom="-0.3rem"
                            marginEnd="size-130"
                          />
                          {p.spbu?.code}
                        </span>
                      )}
                    </View>
                    {role !== 'Owner' && role !== 'none' && p.spbuId > 0 && (
                      <Flex direction="row" flex gap="size-100" wrap>
                        <>
                          {p.salary > 0 && (
                            <View width="140px">
                              <Salary
                                size="S"
                                marginBottom="-0.3rem"
                                marginEnd="size-130"
                              />
                              {FormatNumber(p.salary)}
                            </View>
                          )}
                          {p.allowance > 0 && (
                            <View flex>
                              <Allowance
                                size="S"
                                marginBottom="-0.3rem"
                                marginEnd="size-130"
                              />
                              {FormatNumber(p.allowance)}
                            </View>
                          )}
                        </>
                      </Flex>
                    )}
                  </View>
                </Flex>
                <View flex>
                  <View marginBottom="size-100">
                    <Email
                      size="S"
                      marginBottom="-0.3rem"
                      marginEnd="size-130"
                    />
                    {p.email}
                  </View>
                  {(p.street || p.city) && (
                    <View marginBottom="size-100">
                      <Address
                        size="S"
                        marginBottom="-0.3rem"
                        marginEnd="size-130"
                      />
                      {p.street && p.street}
                      {p.city && p.street && ', '}
                      {p.city}
                    </View>
                  )}
                  {p.phone && (
                    <View marginBottom="size-100">
                      <Phone
                        size="S"
                        marginBottom="-0.3rem"
                        marginEnd="size-130"
                      />
                      {p.phone && p.phone}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </Flex>
        )}
      </View>
    </React.Fragment>
  );
};

export default EmployeeList