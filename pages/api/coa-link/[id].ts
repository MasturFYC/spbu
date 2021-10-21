import { NextApiRequest, NextApiResponse } from 'next';
import api from '../models/coa-link';

export default async function CoaLinkRouter(
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
      const { code, id } = req.query;
      result = await api.delete('' + code, +id);
    }
      break;
    case 'GET':
    default: {
      const { id } = req.query;
      result = await api.list('' + id);
    }
      break;
  }

  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
    //console.log("COA-LINK: ", req.query, req.method, data);
  } else {
    console.log({
      type: 'COA-LINK ERROR:',
      method: req.method,
      param: req.query,
      body: req.body,
      error: result
    })
    res.status(404).json({ message: 'COA-LINK tidak ditemukan.' });
  }

}