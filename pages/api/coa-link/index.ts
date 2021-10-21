import { NextApiRequest, NextApiResponse } from 'next';
import api from '../models/coa-link';

export default async function CoaLinkRouter(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;
  const result = await api.list('' + code);
  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
    //console.log("SPBU Transaction: ", req.method, data);
  } else {
    console.log({
      type: 'COA-LINK ERROR:',
      method: req.method,
      param: req.query,
      body: req.body,
      error: error
    })
    res.status(404).json({ message: 'COA-LINK tidak ditemukan.' });
  }

}