import { NextApiRequest, NextApiResponse } from 'next'
import ImageKit from 'imagekit';
const urlEndpoint = 'https://ik.imagekit.io/at4uyufqd9s';
const publicKey = 'public_s/7hMS5caDc8ei20lSX8qSVKghE=';
const privateKey = 'private_f1ov4Rav4pIqAs+Tny2jZ4eF8LI=';

const imagekit = new ImageKit({
  urlEndpoint: urlEndpoint,
  publicKey: publicKey,
  privateKey: privateKey,
});

const getAuth = (_: NextApiRequest, res: NextApiResponse) => {
  const result = imagekit.getAuthenticationParameters();
  return res.send(result);
}

export default getAuth;