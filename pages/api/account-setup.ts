import { NextApiRequest, NextApiResponse } from 'next';
//import { iAccountSetup } from '@components/interfaces';
import { accounstRepo as api} from '../../lib/account-setup';

export default async function accountSetupApi(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  let result;

  switch (req.method) {
    case 'POST': {
      const {code, accounts} = req.body;
      // api.deleteGroup(code);
      result = api.addGroup(code, accounts)
    }
      break;
    case 'PUT': {
      const { id, account} = req.body;
      result = api.update(id, account);
    }
      break;
    case 'DELETE': {
      const {id} = req.body;
      result = api.delete(id);
    }
      break;

    case 'GET':
    default: {
      const {code} = req.query;
      result = api.getAll().filter(x => x.code === code);
    }
      break;
  }

  if (result) {
    res.status(200).json(result);
    //console.log("SPBU Transaction: ", req.method, data);
  } else {
    console.log('ACCOUNT SETUP ERROR')
    res.status(404).json({ message: 'ACCOUNT SETUP tidak ditemukan.' });
  }

}