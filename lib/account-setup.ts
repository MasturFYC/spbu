import { iAccountSetup } from '@components/interfaces';
import fs from 'fs'


// users in JSON file for simplicity, store in a db for production applications
let accounts: iAccountSetup[] = require('@shared/jsons/account-setup').default;

export const accounstRepo = {
  getAll: () => accounts,
  getById: (id:number) => accounts.find(x => x.id === id),
  create: _create,
  update: _update,
  delete: _delete,
  addGroup: _addGroup,
  deleteGroup: _deleteGroup
};

function _create(account: iAccountSetup) {
  account.id = accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;

  accounts.push(account);
  saveData();
}

function _update(id: number, params: iAccountSetup) {
  const account = accounts.find(x => x.id === id);

  // update and save
  Object.assign(account, params);
  saveData();
  return params;
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
function _delete(id:number) {
  // filter out deleted user and save
  accounts = accounts.filter(x => x.id !== id);
  saveData();
  return id;
}

function _deleteGroup(code: string) {
  accounts = accounts.filter(x => x.code !== code);
  saveData();
  return code;
}


function _addGroup(code: string, params: iAccountSetup[]) {
  const id = accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
  accounts = accounts.filter(x => x.code !== code);

  for(let c= 0; c<params.length; c++) {
    const account = params[c];
    accounts.push({ ...account, code: code, id: id + c + 1})
  }
  saveData();
  return accounts.filter(x => x.code === code);
}

// private helper functions

function saveData() {
  fs.writeFileSync('shared/jsons/account-setup.json', JSON.stringify(accounts, null, 4));
}