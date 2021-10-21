import { NextApiRequest, NextApiResponse } from 'next';
import { iJournalDetail } from '../../../../components/interfaces';
import api from '../../models/journal.model';

export default async function coaIdApi(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const id: number = req.query.id ? +req.query.id : 0;
  const result = await api.getDetail(id);

  const [data, error] = result;
  //console.log(data)

  if (data) {
    res.status(200).json(data);
  } else {
    console.log("ERROR JOURNAL detail: ", req.method, req.body, error);
    res.status(404).json({ message: 'JOURNAL detail tidak ditemukan.' });
  }

}