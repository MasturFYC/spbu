import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs"
import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit'
import QRCode from "qrcode-svg"
import { iVac1 } from '@components/interfaces'
import moment from 'moment';
import 'moment/locale/id'
import 'moment/locale/en-ie'
//import got from 'got';

const url = 'https://ik.imagekit.io/at4uyufqd9s/cov-card/test-2_2Rp8AQD5J.svg?updatedAt=1634386081346';
//'https://ik.imagekit.io/at4uyufqd9s/icons/cov-back-1.jpg?updatedAt=1632123970302'
//import { svgImage as svg } from './vac1-back'

//import { svgImage as svg } from './covid-back-svg'
//import { svgImage as svg } from './vac1-back'

const fetchImage = async (src: string) => {
  const response = await fetch(src);
  //const image = await response.arrayBuffer();
  const image = await response.text();

  return image;
};

const mmToPt = (mm: number): number => {
  return mm * 2.83465;
}
//import profilePic from '../../../public/images/card-2.png'


export default async function covidHandler(req: NextApiRequest, res: NextApiResponse) {
  const { data } = JSON.parse(req.body);

  //   console.log(background)

  const peoples: iVac1[] = data;
  // console.log('-------------------------------------------------')
  // console.log(peoples)
  // console.log('-------------------------------------------------')
  const logo = await fetchImage(url);
  //console.log(logo)
  //let j = 0;
  let pageSize = { width: mmToPt(186), height: mmToPt(56) }
  let y = 0;
  let x = 0;

  //  let peoples: iVac1[] = (await import('../../../shared/jsons/data.json')).default


  y = mmToPt(22);
  x = mmToPt(186 - 88 + 3);
  let gap = mmToPt(2.5);

  const labels = {
    ticket: { name: "Tiket", x: x, y: y },
    nik: { name: "NIK", x: x + mmToPt(57), y: y + (gap) },
    name: { name: "Nama Lengkap", x: x, y: y + (gap) },
    birthDate: { name: "Tanggal Lahir", x: x, y: y + (gap * 2) },
    phone: { name: "No. HP", x: x, y: y + (gap * 3) },
    address: { name: "Alamat", x: x, y: y + (gap * 4) },
    location: { name: "Lokasi Menerima", x: x, y: y + y + (gap * 5) },
  }

  const doubleDot = mmToPt(15);
  const labelWidth = mmToPt(18);
  const dotWidth = mmToPt(2);

  // const background = fs
  //   .readFileSync("public/images/card.svg")
  //   .toString()


  const doc = new PDFDocument({
    compress: true,
    margins: {
      top: 0,
      bottom: 0,
      left: mmToPt(3),
      right: mmToPt(3),
    },
    size: [pageSize.width, pageSize.height],
    autoFirstPage: false
  });

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    //    'Access-Control-Allow-Origin': '*'
  });

  doc.pipe(res);

  peoples.map(async (p: iVac1) => {

    doc.addPage()

    //    SVGtoPDF(doc, logo, 0, 0, { width: mmToPt(186), height: mmToPt(56) })
    //let url = 'https://ik.imagekit.io/at4uyufqd9s/icons/cov-back-1.jpg';

    //    doc.image('https://ik.imagekit.io/at4uyufqd9s/icons/cov-back-1.jpg?updatedAt=1632123970302', 0, 0, { width: mmToPt(186), height: mmToPt(56) });


    //doc.image(logo, 0, 0, { width: mmToPt(186), height: mmToPt(56) });
    SVGtoPDF(doc, logo, 0, 0, { width: mmToPt(186), height: mmToPt(56), precision: 4 })

    x = mmToPt(55.75);
    y = mmToPt(15.575);


    SVGtoPDF(doc, new QRCode({
      content: p.firstQr,
      padding: 2.5,
      width: mmToPt(13.35),
      height: mmToPt(13.35)
    }).svg(), x, y)

    x = mmToPt(153.5)

    SVGtoPDF(doc, new QRCode({
      content: p.nextQr,
      padding: 2.5,
      width: mmToPt(13.35),
      height: mmToPt(13.35)
    }).svg(), x, y)

    //SVGtoPDF(doc, svg(mmToPt(186), mmToPt(56)), 0, 0)

    doc.font('Helvetica', undefined, 4.5).fillColor('white');

    x = mmToPt(23.25); y = mmToPt(16);
    doc.text(p.name, x, y, { width: mmToPt(30.35), align: "center" });

    x = mmToPt(22.92); y = mmToPt(23.92);
    doc.text(p.nik, x, y, { width: mmToPt(16), align: "left" });

    x = mmToPt(39.12); y = mmToPt(23.92);
    doc.text(moment(p.birthDate, 'YYYY-MM-DD', "id").format('DD MMMM YYYY'), x, y, { width: mmToPt(16) });

    /////////////////////////////////////////////////

    x = mmToPt(121.15); y = mmToPt(16);
    doc.text(p.name, x, y, { width: mmToPt(30.35), align: "center" });

    x = mmToPt(120.82); y = mmToPt(23.92);
    doc.text(p.nik, x, y, { width: mmToPt(16), align: "left" });

    x = mmToPt(137.02); y = mmToPt(23.92);
    doc.text(moment(p.birthDate, 'YYYY-MM-DD', "id").format('DD MMMM YYYY'), x, y, { width: mmToPt(16) });

    /////////////////////////////////////////////////

    doc.fillColor([56, 105, 136])

    y = mmToPt(27.353);
    x = 0;
    doc.text("ID : " + p.uuid, x, y, { width: mmToPt(88), align: "center" });
    y = mmToPt(30.4);
    doc.text(`Pada tanggal ${moment(p.firstDate, 'YYYY-MM-DD', "id").format('DD MMMM YYYY')}`, x, y, { width: mmToPt(88), align: "center" });
    y = mmToPt(32.2);
    doc.text(`on date ${moment(p.firstDate, 'YYYY-MM-DD', "en-ie").format('MMMM DD, YYYY')}`, x, y, { width: mmToPt(88), align: "center" });
    y = mmToPt(40.215);
    doc.text(`${p.vacType} COVID - 19 (Batch ID : ${p.firstBatch})`, x, y, { width: mmToPt(88), align: "center" });

    /////////////////////////////////////////////////

    y = mmToPt(27.353);
    x = mmToPt(97.824);
    doc.text("ID : " + p.uuid, x, y, { width: mmToPt(88), align: "center" });
    y = mmToPt(30.4);
    doc.text(`Pada tanggal ${moment(p.nextDate, 'YYYY-MM-DD', "id").format('DD MMMM YYYY')}`, x, y, { width: mmToPt(88), align: "center" });
    y = mmToPt(32.2);
    doc.text(`on date ${moment(p.nextDate, 'YYYY-MM-DD', "en-ie").format('MMMM DD, YYYY')}`, x, y, { width: mmToPt(88), align: "center" });
    y = mmToPt(40.215);
    doc.text(`${p.vacType} COVID - 19 (Batch ID : ${p.nextBatch})`, x, y, { width: mmToPt(88), align: "center" });

  })

  doc.end();

}
