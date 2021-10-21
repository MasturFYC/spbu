import { NextApiRequest, NextApiResponse } from 'next';
import api from '../models/spbu.model';

export default async function spbuApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await api.getList();
  const [data, error] = result;

  if (data) {
    //console.log(req.method, "SPBU", data);
    res.status(200).json(data);
  } else {
    console.log('SPBU:', error)
    res.status(403).json({ message: error.message });
  }

}