import { NextApiRequest, NextApiResponse } from 'next';
import api from '../models/vac1.model';

export default async function vacEndPoint(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let result;

  switch (req.method) {
    case 'POST': {
      const { data } = req.body;
      result = await api.insert(data);
    }
      break;
    case 'PUT': {
      const { id } = req.query;
      const { data } = req.body;
      result = await api.update(+id, data);
    }
      break;
    case 'DELETE': {
      const { id } = req.query;
      result = await api.delete(+id);
    }
      break;
    case 'GET':
    default: {
      result = await api.list();
    }
      break;
  }

  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
    //console.log("SPBU Transaction: ", req.method, data);
  } else {
    console.log({
      type: 'VAC-1 ERROR:',
      method: req.method,
      param: req.query,
      body: req.body,
      error: result
    })
    res.status(404).json({ message: 'SPBU tidak ditemukan.' });
  }

}