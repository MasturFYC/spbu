import { dateParam, hour24Format, isNullOrEmpty, iSpbu } from '../../../components/interfaces'
import db, { nestQuery, sql } from "../config";


type apiReturn = Promise<any[] | (readonly iSpbu[] | undefined)[]>;

interface apiFunction {
  get: (id: number) => apiReturn;
  getList: () => apiReturn;
  delete: (id: number) => apiReturn;
  update: (id: number, data: iSpbu) => apiReturn;
  insert: (data: iSpbu) => apiReturn;
}


const apiSpbu: apiFunction = {
  get: async (id: number) => {

    const query = sql`SELECT id, name, code, street, city, phone, description
      FROM spbu
      WHERE id = ${id}`;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  getList: async () => {

    const empQry = sql`SELECT e.id, e.spbu_id AS "spbuId", e.name, e.email,
    e.photo, e.role, e.salary, e.allowance, e.start_at AS "startAt"
    FROM users AS e
    WHERE e.spbu_id = t.id`;

    const query = sql`SELECT t.id, t.name, t.code, t.street, t.city, t.phone, t.description,
      ${nestQuery(empQry)} AS "employees"
      FROM public.spbu AS t`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  delete: async (id: number) => {
    const query = sql`
    DELETE FROM spbu
    WHERE id = ${id}
    RETURNING *
    `;
    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  update: async (id: number, p: iSpbu) => {

    const query = sql`
      UPDATE spbu SET
      name = ${p.name},
      code= ${p.code},
      street = ${isNullOrEmpty(p?.street)},
      city = ${isNullOrEmpty(p?.city)},
      description= ${isNullOrEmpty(p?.description)},
      updated_at = to_timestamp(${dateParam(p.updatedAt)}, ${hour24Format}),
      phone= ${isNullOrEmpty(p?.phone)}
      WHERE id = ${id}
      RETURNING *
    `;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  insert: async (p: iSpbu) => {
    const query = sql`
      INSERT INTO spbu (
        name, code, street, city, phone, description
      ) VALUES (
        ${p.name},
        ${p.code},
        ${isNullOrEmpty(p?.street)},
        ${isNullOrEmpty(p?.city)},
        ${isNullOrEmpty(p?.phone)},
        ${isNullOrEmpty(p?.description)}
      )
      RETURNING *
    `;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },
};

export default apiSpbu;
