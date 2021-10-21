import { dateParam, hour24Format, iLinkCoa, isNullOrEmpty, linkableCoa } from '../../../components/interfaces'
import db, { nestQuery, sql } from "../config";

type apiReturn = Promise<(readonly iLinkCoa[] | undefined)[] | any[]>;

interface apiFunction {
  list: (code: string) => apiReturn;
  delete: (code: string, id: number) => apiReturn;
  update: (id: number, data: iLinkCoa) => apiReturn;
  insert: (data: iLinkCoa) => apiReturn;
}

const apiLinkCoa: apiFunction = {

  list: async (code: string) => {
    const query = sql<iLinkCoa>`select
      l.id,
      l.acc_id,
      l.code,
      c.name,
      c.description
    from coa_link l join coa c on c.id = l.acc_id
    where l.code = ${code}
    order by l.id`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  delete: async (code: string, id: number) => {
    const query = sql`
    DELETE FROM coa_link
    WHERE code = ${code} and id = ${id}
    RETURNING id
    `;
    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  update: async (id: number, p: iLinkCoa) => {
    //console.log(p.link?.filter(x => x !== '').join(','))

    const query = sql`
      UPDATE coa_link SET
      acc_id = ${p.accId}
      WHERE code = ${p.code} and id = ${id}
      RETURNING *
    `;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  insert: async (p: iLinkCoa) => {
    const query = sql`
      INSERT INTO coa_link (id, acc_id, code) VALUES (
        ${p.id},
        ${p.accId},
        ${p.code}
      )
      RETURNING *
    `;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },
};

export default apiLinkCoa;
