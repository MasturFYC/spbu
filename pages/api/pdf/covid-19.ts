import type { NextApiRequest, NextApiResponse } from 'next'
import PDFDocument, { options } from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit'
import { iCovid, iVaccin } from '../../../components/interfaces'
//import { svgImage as svg } from './cov2-back'
import moment from 'moment';
import 'moment/locale/en-ie'

import api from '../models/vac2.model'

const mmToPt = (mm: number): number => {
  return mm * 2.83465;
}

const svgUrl = 'https://ik.imagekit.io/at4uyufqd9s/cov-card/covid-back.svg';

const fetchImage = async () => {
  const response = await fetch(svgUrl);
  const svg = await response.text();

  return svg;
};

export default async function covidHandler(req: NextApiRequest, res: NextApiResponse) {

  const svgImage = await fetchImage();
 // console.log(svgImage)

  const { data: arrNum } = JSON.parse(req.body);

  const result = await api.getListPrint(arrNum)

  const [peoples, error] = result;
  //console.log('**********************************', peoples)
  // console.log('-------------------------------------------------')
  //let j = 0;
  let pageSize = { width: mmToPt(186), height: mmToPt(56) }
  let y = 0;
  let x = 0;

  //  let peoples: iCovid[] = (await import('../../../shared/jsons/data.json')).default

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


  //  const id = req.query && +req.query.id || 0;

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    //    'Access-Control-Allow-Origin': '*'
  });


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

  //const doubleDot = mmToPt(15);
  const labelWidth = mmToPt(18);
  const dotWidth = mmToPt(2);


  //.filter(x => x.id < 3)


  doc.pipe(res);
  peoples.map((p: iCovid) => {

    doc.addPage()
    SVGtoPDF(doc, svgImage, 0, 0, { width: mmToPt(186), height: mmToPt(56), precision: 4})
    doc
      .font('Helvetica', undefined, 5.5)

      .text(labels.ticket.name, labels.ticket.x, labels.ticket.y)
      .text(':', labels.ticket.x + labelWidth, labels.ticket.y)
      .text(p.ticket, labels.ticket.x + dotWidth + labelWidth, labels.ticket.y)

      .text(labels.nik.name, labels.nik.x, labels.ticket.y)
      .text(':', labels.nik.x + 12, labels.ticket.y)
      .text(p.nik, labels.nik.x + 15, labels.ticket.y)

      .text(labels.name.name, labels.name.x, labels.name.y)
      .text(':', labels.name.x + labelWidth, labels.name.y)
      .text(p.name, labels.name.x + dotWidth + labelWidth, labels.name.y)

      .text(labels.birthDate.name, labels.birthDate.x, labels.birthDate.y)
      .text(':', labels.birthDate.x + labelWidth, labels.birthDate.y)
      .text(moment(p.birthDate).format('YYYY-MM-DD'), labels.birthDate.x + dotWidth + labelWidth, labels.birthDate.y)

      .text(labels.phone.name, labels.phone.x, labels.phone.y)
      .text(':', labels.phone.x + labelWidth, labels.phone.y)
      .text(p.phone, labels.phone.x + dotWidth + labelWidth, labels.phone.y)

      .text(labels.address.name, labels.address.x, labels.address.y)
      .text(':', labels.address.x + labelWidth, labels.address.y)
      .text(p.address, labels.address.x + dotWidth + labelWidth, labels.address.y, { width: 150 })

    //const v1: iVaccin = p.vaccins && p.vaccins[0];

    let v2: iVaccin = {} as iVaccin;

    if (p.vaccins && p.vaccins.length > 0) {
      v2 = p.vaccins[p.vaccins.length - 1]
    }

    y = doc.y + 0.5;
    doc
      .text(labels.location.name, labels.location.x, y)
      .text(':', labels.location.x + labelWidth, y)
      .text(v2.vacLocation, labels.location.x + dotWidth + labelWidth, y)
      .font('Helvetica-Bold')
      .text('Riwayat Pemberian Vaksin Covid-19',
        pageSize.width - mmToPt(88), doc.y + 4,
        { width: mmToPt(88), align: "center" });
    doc.x += mmToPt(3)
    createTable(doc, [48, 35, 28, 56, 60], v2, mmToPt(82));

  })



  //doc.text(test);

  doc.end();

  //console.log('people\n\n', req.body)


}

function createTable(doc: PDFKit.PDFDocument,
  columns: number[],
  values: iVaccin,
  width: number) {
  const colNames: string[] = [
    "Tanggal Vaksinasi",
    "Nama Vaksin",
    "No. Batch",
    "Lokasi Menerima",
    "Keterangan"
  ]
  const startY = doc.y,
    startX = doc.x,
    distanceY = 9,
    distanceX = 5;

  //doc.fontSize(12);

  const currentY = startY;
  let i = 0;
  let currentX = startX

  const propertyValues = Object.values(values);

  columns.forEach(col => {
    //size = col;

    //Write text
    //Create rectangles
    doc
      .rect(currentX, currentY, col, distanceY)
      .fill([0, 100, 225])
      .lineJoin("miter")
      .rect(currentX, currentY, col, distanceY)
      .lineWidth(0.5)
      .stroke("white");

    doc.font('Helvetica', undefined, 5.5)
      .fill("white")
      .text(colNames[i], currentX, currentY + 2, {
        align: "center", width: col
      })


    doc.font('Helvetica', undefined, 5)
      .fill("black")
      .text(propertyValues[i], currentX, currentY + 2.5 + distanceY, {
        align: "center", width: col
      })

    currentX += col;
    i++;
  });
}