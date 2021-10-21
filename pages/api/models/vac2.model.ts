import { dateParam, hour24Format, iCovid } from '../../../components/interfaces'
import db, { nestQuery, sql } from "../config";

type apiReturn = Promise<any[] | (readonly iCovid[] | undefined)[]>;

interface apiFunction {
  list: () => apiReturn;
  search: (name: string | string[]) => apiReturn;
  insert: (data: iCovid) => apiReturn;
  delete: (id: number) => apiReturn;
  update: (id: number, data: iCovid) => apiReturn;
  getListPrint: (ids: number[]) => apiReturn;
}

const apiCovid2: apiFunction = {

  getListPrint: async (ids: number[]) => {
    const subQuery = sql`select
        to_char(s.created_at, 'YYYY-MM-DD HH24:MI:ss') as "createdAt",
        s.vac_type as "vacType",
        s.batch,
        s.vac_location as "vacLocation",
        s.description
      from sub_vac2 s
      where s.vac2_id = t.id
      order by s.id`

    const query = sql`SELECT 
      t.id, t.nik, t.ticket, t.name, t.birth_date, t.phone, t.address,
      ${nestQuery(subQuery)} as "vaccins"
      FROM vac2 AS t
      WHERE t.id in (${sql.join(ids, sql`,`)})
      order by t.id desc`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },


  search: async (name: string | string[]) => {
    const query = sql`SELECT 
      t.id, t.nik, t.ticket, t.name, t.birth_date, t.phone, t.address
      FROM vac2 AS t
      where position(${name} in lower(t.name)) > 0
      order by t.name`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  list: async () => {
    // const subQuery = sql`select
    //   s.vac2_id as "vac2Id", s.id, s.created_at as "createdAt", s.vac_type as "vacType",
    //   s.batch, s.vac_location as "vacLocation", s.description
    //   from sub_vac2 s
    //   where s.vac2_id = t.id
    //   order by s.id`
    // ,
    //${nestQuery(subQuery)} as "vaccins"
    const query = sql`SELECT 
      t.id, t.nik, t.ticket, t.name, t.birth_date, t.phone, t.address
      FROM vac2 AS t
      order by t.id desc`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  delete: async (id: number) => {
    const query = sql`
    DELETE FROM vac2
    WHERE (id = ${id})
    RETURNING *`;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  update: async (id: number, p: iCovid) => {
    const query = sql`UPDATE vac2 SET
      nik = ${p.nik},
      ticket = ${p.ticket},
      name = ${p.name},
      birth_date = to_timestamp(${dateParam(p.birthDate)}, ${hour24Format}),
      phone = ${p.phone},
      address = ${p.address}
    WHERE id = ${id}
    RETURNING *`;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  insert: async (p: iCovid) => {
    const query = sql`
      INSERT INTO vac2 (
        nik, ticket, name, birth_date, phone, address
      ) VALUES (
        ${p.nik},
        ${p.ticket},
        ${p.name},
        to_timestamp(${dateParam(p.birthDate)}, ${hour24Format}),
        ${p.phone},
        ${p.address}
      )
      RETURNING *`;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);

  }
};

export default apiCovid2;
