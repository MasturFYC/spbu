import { NONAME } from "dns";
import moment from "moment";

const stringDateFormat = 'YYYY-MM-DD HH:mm';
export const hour24Format = 'YYYY-MM-DD HH24:MI';
const dateOnlyString = 'YYYY-MM-DD';
export const dateParam = (value?: string | undefined | null) => (value) ? moment(value, stringDateFormat).format(stringDateFormat) : moment(new Date(), stringDateFormat).format(stringDateFormat);
export const dateOnly = (value?: string | undefined | null, format: string = dateOnlyString) => (value) ? moment(value, dateOnlyString).format(format) : moment(new Date(), dateOnlyString).format(format);
export const setRefId = (id: number, code: string) => {
  return code + '-' + id.toString().padStart(9, '0');
}

export enum linkableCoa { NONE = "none", LINKABLE = "linkable" }
export enum postableCoa { NONE = "none", POSTABLE = "postable" }

export const initProduct: iProduct = {
  id: 0,
  code: 0,
  name: '',
  unit: '',
  octan: 0,
  buyPrice: 0,
  salePrice: 0,
  description: '',
  content: 1,
  parentId: 0,
  firstStock: 0,
  beSold: true,
  barcode: '',
  spbuId: 0,
  parentCode: ''
};

export interface iUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  spbuId: number;
}

export interface iEmployee extends iUser {
  photo?: string;
  street?: string;
  city?: string;
  phone?: string;
  salary: number;
  allowance: number;
  startAt: string;
  spbu?: iSpbu;
  bpjsKesehatan: number;
  bpjsKerja: number;
}

export interface iCustomer extends iUser {
  spbuName: string;
}

export interface iSupplier extends iCustomer {
supplier: iUser;
}

export interface iUserLogin {
  userId: number;
  spbuId: number;
  login: string;
  role: string;
  isLoggedIn: boolean;
  photo?: string;
}

export interface iProductSold {
  id: number;
  code: number;
  barcode: string;
  name: string;
  unit: string;
  buyPrice: number;
  salePrice: number;
  content: number;
  firstStock: number;
  stock?: {
    debt: number;
    cred: number;
  }
  description?: string;
}

export interface iProduct extends iProductSold {
  parentId: number;
  spbuId: number;
  beSold: boolean;
  octan: number;
  createdAt?: string;
  updatedAt?: string;
  parentCode?: string;
  spbu?: iSpbu
}

export const mutateOption = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0
}

export interface iSpbu {
  id: number;
  name: string;
  code: string;
  street?: string;
  city?: string;
  phone?: string;
  employees?: iEmployee[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// export interface iCoaType {
//   id: number,
//   name: string;
//   description: string;
//   coas?: iCoa[];
// }

export interface iCoaParent {
  id: number;
  code: number;
  name: string;
}
export interface iCoa extends iCoaParent {
  parentId: number;
  taxId: number;
  description?: string;
  parent?: iCoa;
  subCoa?: iCoa[];
  linkable: linkableCoa;
  postable: postableCoa;
  createdAt?: string;
  updatedAt?: string;
}

export interface iOperator {
  id: number
  name: string
  email: string
  street: string
  city: string
  phone: string
  spbu_id: number
}

export interface iJournal {
  id: number;
  code: string; // umum: UMM, dombak: DOM, tiang: TNG; kasbon: BON, gaji: GJI
  refId: number;
  userId: number;
  proof?: string;
  dateTransact: string;
  dateOutput?: string;
  tags?: string;
  memo?: string;
  files?: string[];
  totalDebt?: number;
  totalCred?: number;
  createdAt?: string;
  updatedAt?: string;
  details?: iJournalDetail[];
  operator?: iOperator; // iUser
  customer?: iOperator; // iUser
}

export interface iJournalDetail {
  journalId: number;
  id: number;
  coaId: number;
  description?: string;
  debt: number;
  cred: number;
  createdAt?: string;
  updatedAt?: string;
  coa?: iCoa;
  journal?: iJournal;
  isChanged?: boolean;
  isNew?: boolean;
}

export interface iVaccin {
  vac2Id: number;
  id: number;
  createdAt: string;
  vacType: string;
  batch: string;
  vacLocation: string;
  description: string;
  isNew?: boolean;
  isChanged?: boolean;
  isSelected?: boolean;
}
export interface iCovid {
  id: number;
  ticket: string;
  nik: string;
  name: string;
  birthDate: string;
  phone: string;
  address: string;
  vaccins?: iVaccin[];
  isSelected?: boolean;
}
interface iCoaLink {
  id: string;
  name: string;
}

export interface iOrder {
  journalId: number
  id: number
  productId: number
  name?: string
  typeId: number
  qty: number
  content: number
  debt: number
  cred: number
  meterDebt: number
  meterCred: number
  unit: string
  buyPrice: number
  salePrice: number
  discount: number
  subTotal: number
  createdAt?: string
  updatedAt?: string
  isNew?: boolean
  isChanged?: boolean
  barcode?: string
}

export interface iAccountSetup {
  id: number;
  code: string;
  name: string;
  desc: string;
  accId: number,
}

export const isNullOrEmpty = (s: string | undefined): string | null => {
  if (undefined === s) return null;
  if (s === null) return null;
  if (s.trim().length === 0) return null;
  return s.trim();
}

export const listLink: iCoaLink[] = [
  {
    id: 'ORD',
    name: 'Order'
  }, {
    id: 'JRU',
    name: 'Journal Umum'
  },
  {
    id: 'STC',
    name: 'Stock'
  }
]


export function generateId(min: number, max: number) {
  return -Math.floor(
    Math.random() * (max - min) + min
  )
}

export interface iVac1 {
  id: number;
  uuid: string;
  name: string;
  nik: string;
  birthDate: string;
  firstDate: string;
  nextDate: string;
  vacType: string;
  firstBatch: string;
  nextBatch: string;
  firstQr: string;
  nextQr: string;
  isSelected: boolean;
}

export interface iLinkCoa {
  id: number;
  accId: number;
  code: string;
  name?: string;
  description?: string;
}
