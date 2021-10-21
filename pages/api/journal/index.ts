import { NextApiRequest, NextApiResponse } from 'next';
import api from '../models/journal.model';

export default async function journalApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { s, e } = req.query;
  const result = await api.listByDate(s, e);
  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
  } else {
    console.log(": ", req.method, error);
    res.status(404).json({ message: error.message });
  }

}