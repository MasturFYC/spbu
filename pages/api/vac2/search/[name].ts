import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../models/vac2.model';

export default async function vac1SearchPeople(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { name } = req.query
  const result = await api.search(name);
  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
    //console.log("SPBU Transaction: ", req.method, data);
  } else {
    console.log({
      type: 'VAC-1 SEARCH ERROR:',
      method: req.method,
      param: req.query,
      body: req.body,
      error: error
    })
    res.status(404).json({ message: 'SPBU tidak ditemukan.' });
  }

}