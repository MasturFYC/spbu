import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../models/employee.model';

export default async function employeeApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;

  const result = await api.search(name);
  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
  } else {
    console.log("ERROR EMPLOYEE: ", req.method, error);
    res.status(403).json({ message: error.message });
  }

}