import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../../models/order.model';
import apiJournal from '../../../models/journal-detail.model';

export default async function journalOrderApi(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const journalId = req.query.id ? +req.query.id : 0;
  const { orders, journalDetails, journalDetailIds, ids } = req.body;

  await apiJournal.update(journalId, journalDetails, journalDetailIds);
  const result = await api.updateSpbu(journalId, orders, ids);

  const [data, error] = result;

  if (data) {
    res.status(200).json({ data: data });
  } else {
    console.log("ERROR JOURNAL-SPBU: ", req.method, req.body);
    res.status(404).json({ message: 'Order Journal tidak ditemukan.' });
  }

}