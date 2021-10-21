import { NextApiRequest, NextApiResponse } from 'next';
import { iEmployee } from '../../../components/interfaces';
import api from '../models/employee.model';

export default async function employeeIdApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let result;

  switch (req.method) {
    case 'POST': {
      const id: number = req.query.id ? +req.query.id : 0;
      const { file: photo } = req.body;
      result = await api.updateImage(id, photo);
    } break;
    case 'PUT': {
      const id: number = req.query.id ? +req.query.id : 0;
      const employee = req.body as iEmployee;
      result = await api.update(id, employee);
    }
      break;
    case 'DELETE': {
      const id: number = req.query.id ? +req.query.id : 0;
      result = await api.delete(id);
    }
      break;

    case 'GET':
    default: {
      const id: number = req.query.id ? +req.query.id : 0;
      result = await api.getEmployee(id);
    }
      break;
  }

  const [data, error] = result;


  if (data) {
    res.status(200).json(data);
  } else {
    console.log("ERROR EMPLOYEE: ", req.method, error);
    res.status(404).json({ message: 'Karyawan tidak ditemukan.' });
  }

}