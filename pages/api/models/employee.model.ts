import { dateParam, hour24Format, iEmployee, iCustomer, isNullOrEmpty } from '../../../components/interfaces'
import db, { nestQuerySingle, sql } from "../config";


type apiReturn = Promise<any[] | (readonly iEmployee[] | iCustomer[] | undefined)[]>;

interface apiFunction {
  search: (name: string | string[]) => apiReturn;
  getEmployee: (id: number) => apiReturn;
  getList: () => apiReturn;
  getOperatorBySpbu: (spbuId: number) => apiReturn;
  delete: (id: number) => apiReturn;
  update: (id: number, data: iEmployee) => apiReturn;
  updateImage: (id: number, photo: string) => apiReturn;
}

const apiEmployee: apiFunction = {
  search: async (txt: string | string[]) => {
    const spbuQry = sql`
    SELECT t.id, t.name, t.code, t.street, t.city, t.phone, t.description
    FROM spbu AS t
    WHERE t.id = e.spbu_id
    `
    const query = sql`SELECT
      e.id, e.name, e.email, e.role, e.spbu_id, e.street, e.city, e.phone, e.photo,
      e.salary, e.allowance, e.start_at, e.bpjs_kesehatan, e.bpjs_kerja,
      ${nestQuerySingle(spbuQry)} AS spbu
      FROM users AS e
      WHERE POSITION(${txt} IN LOWER(e.name)) > 0`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },
  updateImage: async (id: number, photo: string) => {
    const query = sql`UPDATE users SET photo = ${photo}
      WHERE id = ${id}
      RETURNING *`;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  getEmployee: async (id: number) => {
    const spbuQry = sql`SELECT
    t.id, t.name, t.code, t.street, t.city, t.phone, t.description
    FROM spbu AS t
    WHERE t.id = e.spbu_id
    `
    const query = sql`SELECT 
      e.id, e.name, e.email, e.role, e.spbu_id, e.street, e.city, e.phone, e.photo,
      e.salary, e.allowance, e.start_at, e.bpjs_kesehatan, e.bpjs_kerja,
      ${nestQuerySingle(spbuQry)} AS spbu
      FROM users AS e
      WHERE e.id = ${id}`;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  getOperatorBySpbu: async (spbuId: number) => {
    const query = sql`SELECT 
      e.id, e.name, e.email, e.role, e.spbu_id, e.street, e.city, e.phone, e.photo,
      e.salary, e.allowance, e.start_at, e.bpjs_kesehatan, e.bpjs_kerja,
      s.nama as spbuName
      FROM users AS e
      JOIN spu as s on s.id = e.spbuId
      WHERE e.spbuId = ${spbuId}`;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  getList: async () => {
    const spbuQry = sql`SELECT
    t.id, t.name, t.code, t.street, t.city, t.phone, t.description
    FROM spbu AS t
    WHERE t.id = e.spbu_id
    `
    const query = sql`SELECT
      e.id, e.name, e.email, e.role, e.spbu_id, e.street, e.city, e.phone, e.photo,
      e.salary, e.allowance, e.start_at, e.bpjs_kesehatan, e.bpjs_kerja,
      ${nestQuerySingle(spbuQry)} AS spbu
      FROM users AS e`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  delete: async (id: number) => {
    const query = sql`
    DELETE FROM users
    WHERE id = ${id}
    RETURNING *
    `;
    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  update: async (id: number, p: iEmployee) => {

    const query = sql`
      UPDATE users SET
      role = ${p.role},
      spbu_id = ${p.spbuId},
      street = ${isNullOrEmpty(p?.street)},
      city = ${isNullOrEmpty(p?.city)},
      phone = ${isNullOrEmpty(p?.phone)},
      photo = ${isNullOrEmpty(p?.photo)},
      salary = ${p.salary},
      allowance = ${p.allowance},
      bpjs_kesehatan = ${p.bpjsKesehatan},
      bpjs_kerja = ${p.bpjsKerja},
      updated_at = to_timestamp(${dateParam(p.updatedAt)}, ${hour24Format})
      WHERE id = ${id}
      RETURNING *
    `;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  }
};

export default apiEmployee;
