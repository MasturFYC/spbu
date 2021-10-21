import { NextApiRequest, NextApiResponse } from 'next';
import api from '../models/coa.model';

export default async function linkCoaApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { links } = req.query;
  const result = await api.listByLink(('' + links).split(' '));

  const [data, error] = result;

  if (data) {
    //  console.log("LIST-COA: ", data);
    res.status(200).json(data);
  } else {
    console.log("ERROR COA: ", req.method, error);
    res.status(403).json({ message: error.message });
  }

}