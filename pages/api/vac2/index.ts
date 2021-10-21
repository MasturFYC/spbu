import { NextApiRequest, NextApiResponse } from 'next';
import api from '../models/vac2.model';

export default async function vacEndPoint(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const result = await api.list();
  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
    //console.log("SPBU Transaction: ", req.method, data);
  } else {
    console.log({
      type: 'VAC-2 LIST ERROR:',
      method: req.method,
      param: req.query,
      body: req.body,
      error: error
    })
    res.status(404).json({ message: 'SPBU tidak ditemukan.' });
  }

}