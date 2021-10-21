import { iUserLogin } from '../../components/interfaces';
import withSession from '../../lib/session';
import api from './models/user-model';

export default withSession(async (req, res) => {
  const { email, password } = req.body;
  const result = await api.getUser(email, password);
  const [data] = result;

  try {
    const { name, role, spbuId, id: userId, photo } = data;
    const user: iUserLogin = { isLoggedIn: true, login: name, role: role, spbuId: spbuId, userId: userId, photo: photo };
    // console.log('log-again')
    // console.log('USER Transaction: ', req.method, user);
    req.session.set("user", user);
    await req.session.save();
    // res.setHeader("cache-control", "no-store, max-age=0");
    res.status(200).json(user);
  } catch (error) {
    //const { response: fetchResponse } = error;
    res.status(500).json({ error: 'Error Login', err: error });//fetchResponse?.status || 500).json(error.data);
  }
});
