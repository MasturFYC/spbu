import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../models/product.model';

export default async function productApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;

  const result = await api.search(name);
  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
    //console.log("Search Employee Transaction: ", req.method, data);
  } else {
    console.log("Search Employee Transaction: ", req.method, error);
    res.status(403).json({ message: error.message });
  }

}