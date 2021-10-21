import { NextApiRequest, NextApiResponse } from 'next';
import api from '../models/vac2-sub.model';

export default async function vac2EndPoint(
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
      //console.log('-----------------------------', id, data)
      result = await api.update(+id, data);
    }
      break;
    case 'DELETE': {

      const { id, vac2Id } = req.query;
      console.log(id, vac2Id)
      result = await api.delete(+id, +vac2Id);
    }
      break;
    case 'GET':
    default: {
      const { id } = req.query;
      result = await api.list(+id);
    }
      break;
  }

  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
    //console.log("SPBU Transaction: ", req.method, data);
  } else {
    console.log({
      type: 'VAC-2 SUB ERROR:',
      method: req.method,
      param: req.query,
      body: req.body,
      error: result
    })
    res.status(404).json({ message: 'Data Vaksin tidak ditemukan.' });
  }

}