import { iVac1 } from '../../../components/interfaces'
import db, { sql } from "../config";


type apiReturn = Promise<any[] | (readonly iVac1[] | undefined)[]>;

interface apiFunction {
  list: () => apiReturn;
  search: (name: string | string[]) => apiReturn;
  insert: (data: iVac1) => apiReturn;
  delete: (id: number) => apiReturn;
  update: (id: number, data: iVac1) => apiReturn;
}

const apiVac1: apiFunction = {
  list: async () => {
    const query = sql`SELECT 
      t.id, t.uuid, t.name, t.birth_date, t.first_date, t.next_date,
      t.vac_type, t.first_batch, t.next_batch, t.first_qr,
      t.next_qr, t.nik
      FROM vac1 AS t
      order by t.id desc`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  search: async (name: string | string[]) => {
    const query = sql`SELECT 
      t.id, t.uuid, t.name, t.birth_date, t.first_date, t.next_date,
      t.vac_type, t.first_batch, t.next_batch, t.first_qr,
      t.next_qr, t.nik
      FROM vac1 AS t
      where position(${name} in lower(t.name)) > 0
      order by t.name desc`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },


  delete: async (id: number) => {
    const query = sql`
    DELETE FROM vac1
    WHERE (id = ${id})
    RETURNING *`;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  update: async (id: number, p: iVac1) => {
    const query = sql`UPDATE vac1 SET
      uuid = ${p.uuid || null},
      name = ${p.name},
      birth_date = to_timestamp(${p.birthDate}, ${'YYYY-MM-DD'}),
      first_date = to_timestamp(${p.firstDate}, ${'YYYY-MM-DD'}),
      next_date = to_timestamp(${p.nextDate}, ${'YYYY-MM-DD'}),
      vac_type = ${p.vacType},
      first_batch = ${p.firstBatch},
      next_batch = ${p.nextBatch},
      first_qr = ${p.firstQr},
      next_qr = ${p.nextQr},
      nik = ${p.nik}
    WHERE id = ${id}
    RETURNING *`;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  insert: async (p: iVac1) => {
    const query = sql`
      INSERT INTO vac1 (
        uuid,
        name,
        birth_date,
        first_date,
        next_date,
        vac_type,
        first_batch,
        next_batch,
        first_qr,
        next_qr,
        nik
      ) VALUES (
        ${p.uuid},
        ${p.name},
        to_timestamp(${p.birthDate}, ${'YYYY-MM-DD'}),
        to_timestamp(${p.firstDate}, ${'YYYY-MM-DD'}),
        to_timestamp(${p.nextDate}, ${'YYYY-MM-DD'}),
        ${p.vacType},
        ${p.firstBatch},
        ${p.nextBatch},
        ${p.firstQr},
        ${p.nextQr},
        ${p.nik}
      )
      RETURNING *`;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  }
};

export default apiVac1;
