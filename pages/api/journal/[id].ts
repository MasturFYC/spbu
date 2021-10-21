import { NextApiRequest, NextApiResponse } from 'next';
import { iJournal } from '../../../components/interfaces';
import api from '../models/journal.model';

export default async function coaIdApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let result;

  switch (req.method) {
    case 'POST': {
      const j = req.body as iJournal;
      result = await api.insert(j);
    } break;
    case 'PUT': {
      const id: number = req.query.id ? +req.query.id : 0;
      const j = req.body as iJournal;
      result = await api.update(id, j);
    }
      break;
    case 'DELETE': {
      const id: number = req.query.id ? +req.query.id : 0;
      result = await api.delete(id);
    }
      break;

    case 'GET':
    default: {
      const id: number = req.query.id ? +req.query.id : 0;
      result = await api.get(id);
    }
      break;
  }

  const [data, error] = result;


  if (data) {
    res.status(200).json(data);
  } else {
    console.log("ERROR JOURNAL SPBU: ", req.method, req.body, error);
    res.status(404).json({ message: 'Order SPBU tidak ditemukan.' });
  }

}