import { NextApiRequest, NextApiResponse } from 'next';
import { iJournal } from '../../../components/interfaces';
import api from '../models/journal.model';

export default async function coaIdApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id: number = req.query.id ? +req.query.id : 0;
  const result = await api.get(id);

  // switch (req.method) {
  //   case 'GET':
  //   default: {
  //     const id: number = req.query.id ? +req.query.id : 0;
  //     result = await api.get(id);
  //   }
  //   break;
  // }

  const [data, error] = result;


  if (data && data.length > 0) {
    res.status(200).json(data[0]);
  } else {
    console.log("ERROR GET-STOCK: ", req.method, req.query, error);
    res.status(404).json({ message: 'Order SPBU tidak ditemukan.' });
  }

}