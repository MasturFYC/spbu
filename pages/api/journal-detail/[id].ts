import { NextApiRequest, NextApiResponse } from 'next';
import api from '../models/journal-detail.model';

export default async function coaIdApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
//  let result;

  // switch (req.method) {
  //   case 'POST': {

      const journalId = req.query.id ? +req.query.id : 0;
      //console.log(req.body)
      const { details, ids } = req.body;


      const result = await api.update(journalId, details, ids);
  //   } break;
  //   case 'DELETE': {
  //     const ids: number[] = req.body;
  //     result = await api.delete(ids);
  //   }
  //     break;
  // }

  const [data, error] = result;

  // console.log('===================================',
  // data,
  //   '===================================')


  if (data) {
    //console.log(data)
    res.status(200).json({data: data});
  } else {
    console.log("ERROR JOURNAL-DETAIL: ", req.method, req.body);
    res.status(404).json({ message: 'COA tidak ditemukan.' });
  }

}