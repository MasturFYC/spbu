import { dateParam, hour24Format, iCoa, iCoaParent, isNullOrEmpty, linkableCoa } from '../../../components/interfaces'
import db, { nestQuery, sql } from "../config";

type apiReturn = Promise<(readonly iCoa[] | iCoaParent[] | undefined)[] | any[]>;

interface apiFunction {
  get: (id: number) => apiReturn;
  list: () => apiReturn;
  listByLink: (links: string[]) => apiReturn;
  parentList: () => apiReturn;
  search: (name: string | string[]) => apiReturn;
  delete: (id: number) => apiReturn;
  update: (id: number, data: iCoa) => apiReturn;
  insert: (data: iCoa) => apiReturn;
}

const apiCOA: apiFunction = {

  listByLink: async () => {
    const query = sql`SELECT 
      p.parent_id,
      p.id,
      p.code,
      p.name,
      p.tax_id,
      p.description,
      p.updated_at,
      p.linkable,
      p.postable
    FROM coa AS p
    WHERE linkable ${linkableCoa.LINKABLE}`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },
  search: async (name: string | string[]) => {
    // const subCoaQry = sql`SELECT s.parent_id as "parentId", s.id, s.code, s.name,
    // s.coa_type_id AS "coaTypeId",
    // s.tax_id AS "taxId", s.description
    // FROM coa AS s
    // WHERE s.parent_id = p.id
    // ORDER BY s.name`;

    const query = sql<iCoa>`select
      parent_id,
      id,
      code,
      name,
      tax_id,
      description,
      updated_at,
      linkable,
      postable
    from search_coa (${name}::varchar(50))`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  get: async (id: number) => {
    const subCoaQry = sql`SELECT s.id, s.code, s.name, s.description,
    s.tax_id AS "taxId", s.linkable, s.postable, s.parent_id as "parentId"
    FROM coa AS s
    WHERE s.parent_id = p.id`;

    const query = sql`SELECT p.parent_id, p.id, p.code, p.name,
    p.linkable, p.postable, p.tax_id, p.description,
    ${nestQuery(subCoaQry)} as "subCoa"
    FROM coa AS p
    WHERE p.id = ${id}`;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  parentList: async () => {

    const query = sql`select t.id, t.code, t.name
    from get_coa_parent() as t`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  list: async () => {
    const query = sql<iCoa>`select
      id,
      code,
      name,
      tax_id,
      description,
      postable,
      linkable,
      parent_id,
      updated_at
    from get_coa_list(6::smallint)`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  delete: async (id: number) => {
    const query = sql`
    DELETE FROM coa
    WHERE id = ${id}
    RETURNING *
    `;
    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  update: async (id: number, p: iCoa) => {
    //console.log(p.link?.filter(x => x !== '').join(','))

    const query = sql`
      UPDATE coa SET
      parent_id = ${p.parentId},
      code = ${p.code},
      name = ${p.name},
      tax_id = ${p.taxId},
      linkable = ${p.linkable},
      postable = ${p.postable},
      updated_at = to_timestamp(${dateParam(p.updatedAt)}, ${hour24Format}),
      description = ${isNullOrEmpty(p.description)}
      WHERE id = ${id}
      RETURNING *
    `;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  insert: async (p: iCoa) => {
    const query = sql`
      INSERT INTO coa (parent_id, code, name, tax_id, postable, linkable, description) VALUES (
        ${p.parentId},
        ${p.code},
        ${p.name},
        ${p.taxId},
        ${p.postable},
        ${p.linkable},
        ${p.description || null}
      )
      RETURNING *
    `;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },
};

export default apiCOA;
