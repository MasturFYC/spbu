import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../../models/order.model';
import apiJournal from '../../../models/journal-detail.model';

export default async function journalOrderApi(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const journalId = req.query.id ? +req.query.id : 0;
  const { orderDetails, journalDetails, deletedJournalDetailIds, deletedDetailIds } = req.body;


  const test = await apiJournal.update(journalId, journalDetails, deletedJournalDetailIds);
  const result = await api.updateCommonOrder(journalId, orderDetails, deletedDetailIds);

  const [data, error] = result;

  if (data) {
    res.status(200).json({ data: data });
  } else {
    console.log("ERROR JOURNAL ORDER-DETAIL: ", req.method, req.body);
    res.status(404).json({ message: 'ORDER-DETAIL tidak ditemukan.' });
  }

}