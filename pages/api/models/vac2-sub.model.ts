
import { dateParam, hour24Format, iVaccin } from '../../../components/interfaces'
import db, { nestQuery, sql } from "../config";

type apiReturn = Promise<any[] | (readonly iVaccin[] | undefined)[]>;

interface apiFunction {
  list: (id: number) => apiReturn;
  insert: (data: iVaccin) => apiReturn;
  delete: (id: number, p: number) => apiReturn;
  update: (id: number, data: iVaccin) => apiReturn;
}

const apiVaccin2: apiFunction = {
  list: async (id: number) => {

    const query = sql`SELECT 
      s.vac2_id, s.id, to_char(s.created_at, 'YYYY-MM-DD HH24:MI:ss') as "createdAt", s.vac_type,
      s.batch, s.vac_location, s.description
      from sub_vac2 s
      where s.vac2_id = ${id}
      order by s.vac2_id, s.id`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  delete: async (id: number, p: number) => {
    const query = sql`
    DELETE FROM sub_vac2
    WHERE (id = ${id} and vac2_id = ${p})
    RETURNING *`;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  update: async (id: number, p: iVaccin) => {
    //console.log(p)
    const query = sql`UPDATE sub_vac2 SET
    created_at = to_timestamp(${dateParam(p.createdAt)}, ${hour24Format}),
    vac_type = ${p.vacType},
    batch = ${p.batch},
    vac_location = ${p.vacLocation},
    description = ${p.description}
    WHERE vac2_id = ${p.vac2Id} and id = ${id}
    RETURNING *`;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  insert: async (p: iVaccin) => {
    const query = sql`INSERT INTO sub_vac2 (
      vac2_id, id, created_at, vac_type, batch, vac_location, description
    ) values (
      ${p.vac2Id},
      ${p.id},
      to_timestamp(${dateParam(p.createdAt)}, ${hour24Format}),
      ${p.vacType},
      ${p.batch},
      ${p.vacLocation},
      ${p.description}
      )
      RETURNING *`

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  }
};

export default apiVaccin2;
