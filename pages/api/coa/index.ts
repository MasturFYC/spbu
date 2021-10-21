import { NextApiRequest, NextApiResponse } from 'next';
import api from '../models/coa.model';

export default async function coaApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await api.list();
  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
  } else {
    console.log("ERROR COA LIST: ", req.method, error);
    res.status(403).json({ message: error.message });
  }

}