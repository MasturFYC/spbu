import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../models/order.model';

export default async function journalOrderApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id: number = req.query.id ? +req.query.id : 0;
  const result = await api.getList(id);
  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
  } else {
    console.log("ERROR JOURNAL SPBU: ", req.method, error);
    res.status(404).json({ message: error.message });
  }

}