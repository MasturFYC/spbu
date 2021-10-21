import { NextApiRequest, NextApiResponse } from 'next';
import { iCoa } from '../../../components/interfaces';
import api from '../models/coa.model';

export default async function coaIdApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let result;

  switch (req.method) {
    case 'POST': {
      const coa = req.body as iCoa;
      result = await api.insert(coa);
    } break;
    case 'PUT': {
      const id: number = req.query.id ? +req.query.id : 0;
      const coa = req.body as iCoa;
      result = await api.update(id, coa);
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
    console.log("ERROR COA ---: ", req.method, 'body', req.body, error);
    res.status(404).json({ message: 'COA tidak ditemukan.' });
  }

}