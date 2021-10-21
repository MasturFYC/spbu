import { NextApiRequest, NextApiResponse } from 'next';
import { iProduct } from '../../../components/interfaces';
import api from '../models/product.model';

export default async function productApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await api.getList();
  const [data, error] = result;

  if (data) {
    res.status(200).json(data);    
  } else {
    console.log("ERROR PRODUCT LIST: ", req.method, error);
    res.status(403).json({ message: error.message });
  }

}