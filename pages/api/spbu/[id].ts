import { NextApiRequest, NextApiResponse } from 'next';
import { iSpbu } from '../../../components/interfaces';
import api from '../models/spbu.model';

export default async function spbuIdApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let result;

  switch (req.method) {
    case 'POST': {
      const spbu = req.body as iSpbu;
      result = await api.insert(spbu);
    }
      break;
    case 'PUT': {
      const id: number = req.query.id ? +req.query.id : 0;
      const spbu = req.body as iSpbu;
      result = await api.update(id, spbu);
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
    //console.log("SPBU Transaction: ", req.method, data);
  } else {
    console.log('SPBU ERROR:', error)
    res.status(404).json({ message: 'SPBU tidak ditemukan.' });
  }

}