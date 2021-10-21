import api from './models/user-model';
import withSession from '../../lib/session';
import { iUser, iUserLogin } from '../../components/interfaces';

export default withSession(async (req, res) => {

  const userData = req.body as iUser;
  const result = await api.insert(userData);
  const [data, error] = result;

  if (data) {
    const user: iUserLogin = { login: data.name, isLoggedIn: true, role: data.role, spbuId: data.spbuId, userId: data.id };
    //console.log('USER Transaction: ', req.method, user);
    req.session.set('user', user);
    await req.session.save();
    res.status(200).json(user);
  } else {
    console.log(error)
    res.status(500).json({ message: "Nama user dan email salah, atau sudah terdaftar.", error: error });
  }
});