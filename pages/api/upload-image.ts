import { NextApiRequest, NextApiResponse } from 'next';
import { File } from "formidable";
import Formidable from "formidable-serverless";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function uploadFormFiles(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const test = new Promise((resolve, reject) => {

    const form = new Formidable.IncomingForm({
      multiples: false,
      keepExtensions: true,
    });


    form
      .on("file", (name: string, file: File) => {
        const data = fs.readFileSync(file.path);
        fs.writeFileSync(`public/assets/${file.name}`, data);
        fs.unlinkSync(file.path);
      })
      .on("aborted", () => {
        reject(res.status(500).send('Aborted'))
      })
      .on("end", () => {
        resolve(res.status(200).send('done'));
      });

    form.parse(req)
  });
}
