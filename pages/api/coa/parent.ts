import { NextApiRequest, NextApiResponse } from 'next';
import api from '../models/coa.model';

export default async function loadCoaApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await api.parentList();
  const [data, error] = result;

  if (data) {
    //console.log("PRENT LIST-COA: ", data);
    res.status(200).json(data);
  } else {
    console.log("ERROR PARENT COA: ", req.method, error);
    res.status(403).json({ message: error.message });
  }

}