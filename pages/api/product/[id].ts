import { NextApiRequest, NextApiResponse } from 'next';
import { iProduct } from '../../../components/interfaces';
import api from '../models/product.model';

export default async function productApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let result;

  switch (req.method) {
    case 'POST': {
      const product = req.body as iProduct;
      result = await api.insert(product);
    }
      break;
    case 'PUT': {
      const id: number = req.query.id ? +req.query.id : 0;
      const product = req.body as iProduct;
      result = await api.update(id, product);
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
      result = await api.getProduct(id);
    }
      break;
  }

  const [data, error] = result;

  if (data) {
    res.status(200).json(data);
  } else {
    console.log("Product Transaction: ", req.method, error);
    res.status(404).json({ message: 'Produk tidak ditemukan.' });
  }

}