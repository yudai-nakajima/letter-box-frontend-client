import { FC, useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { employeeType } from '../../../types/Employee';
import { storeType } from '../../../types/Store';

type Props = {
  selectedStore: storeType | null;
  selectedEmployee: employeeType | null;
  setSelectedEmployee: React.Dispatch<
    React.SetStateAction<employeeType | null>
  >;
};

type apiResponse = {
  // eslint-disable-next-line
  store_id: number;
  employees: employeeType[];
};

const defaultEmployee = { id: NaN, first_name: '', last_name: '' };
const defaultEmployeees = [defaultEmployee];

const Index: FC<Props> = ({
  selectedStore,
  selectedEmployee,
  setSelectedEmployee,
}) => {
  const [employees, setEmployees] = useState<employeeType[]>(defaultEmployeees);

  const history = useHistory();

  useEffect(() => {
    if (selectedStore?.id) {
      axios
        .get<apiResponse>(
          `http://localhost:3000/api/v1/employees/search?store_id=${selectedStore.id}`,
        )
        .then((res) => setEmployees(res.data.employees))
        // eslint-disable-next-line
        .catch((err) => console.log(err));
    } else {
      setEmployees(defaultEmployeees);
    }
  }, [selectedStore]);

  return (
    <Autocomplete
      id="disable-close-on-select"
      // disableCloseOnSelect
      options={employees}
      getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
      renderInput={(params) => (
        <TextField
          // eslint-disable-next-line
          {...params}
          label="従業員の名前"
          variant="standard"
        />
      )}
      disabled={Number.isNaN(selectedStore?.id)}
      onChange={(evnet, value) => {
        if (value && selectedStore) {
          history.push(`/message/${selectedStore.id}/${value.id}`);
          setSelectedEmployee(value);
        } else if (selectedStore) {
          history.push(`/message/${selectedStore.id}`);
          setSelectedEmployee(defaultEmployee);
        } else {
          history.push(`/`);
          setSelectedEmployee(defaultEmployee);
        }
      }}
      value={selectedEmployee}
    />
  );
};

export default Index;
