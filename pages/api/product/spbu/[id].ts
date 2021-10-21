import { iProduct } from '@components/interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../models/product.model';

export default async function productBybSpbuApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id: number = req.query.id ? +req.query.id : 0;
  const result = await api.getProductBySpbu(id);
  const [data, error] = result;

  if (data) {
    //console.log('get product an last stock od product:', data)
    res.status(200).json(data);
  } else {
    console.log("PRODUCT BY SPBU: ", req.method, error);
    res.status(403).json({ message: error.message });
  }

}