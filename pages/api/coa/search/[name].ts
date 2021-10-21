import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../models/coa.model';

export default async function coaApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;
  //console.log(name)
  const result = await api.search((''+name).toLocaleLowerCase());

  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
  } else {
    console.log("ERROR SEARCH COA: ", req.method, error);
    res.status(403).json({ message: error.message });
  }

}