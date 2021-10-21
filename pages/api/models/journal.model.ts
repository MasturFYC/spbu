import { iJournal, dateParam, hour24Format, iJournalDetail, isNullOrEmpty, iUserLogin, iOperator, iSupplier } from '@components/interfaces'
import db, { nestQuery, nestQuerySingle, sql } from "../config";

type apiReturn = Promise<any[] | (readonly iJournal[] | undefined)[]>;

interface apiFunction {
  get: (id: number) => apiReturn;
  listByDate: (dateStart: string | string[], dateEnd: string | string[]) => apiReturn;
  listByStock: (dateStart: string | string[], dateEnd: string | string[]) => apiReturn;
  search: (name: string | string[]) => apiReturn;
  delete: (id: number) => apiReturn;
  update: (id: number, data: iJournal) => apiReturn;
  insert: (data: iJournal) => apiReturn;
  getDetail: (id: number) => Promise<any[] | (readonly iJournalDetail[] | undefined)[]>;
}


const apiJournal: apiFunction = {

  getDetail: async (id: number) => {
    const query = sql<iJournalDetail>`SELECT
      p.journal_id, p.id, p.coa_id, p.description, p.updated_at,
      p.created_at, p.debt, p.cred
    FROM journal_detail AS p
    WHERE p.journal_id = ${id}
    order by p.journal_id, p.id`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  search: async (name: string | string[]) => {

    const userQry = sql<iUserLogin>`select
    t.id, t.name, t.email, t.street, t.city, t.phone, t.spbu_id
    from users as t
    where t.id = p.user_id
    `;
    const customerQry = sql<iOperator>`select
    t.id, t.name, t.email, t.street, t.city, t.phone, t.spbu_id
    from users as t
    where t.id = p.customer_id
    `;
    const query = sql<iJournal>`SELECT 
      p.id,
      p.code,
      p.ref_id,
      p.user_id,
      p.code ||'-'|| to_char(p.id,'000000000') as proof,
      to_char(p.date_transact, 'DD-MON-YYYY') AS "dateOutput",
      p.date_transact,
      p.tags,
      p.memo,
      p.created_at,
      p.updated_at,
      ${nestQuerySingle(userQry)} as operator,
      ${nestQuerySingle(customerQry)} as customer
    FROM journal AS p
    WHERE POSITION(${name} IN LOWER(p.code)) > 0
    OR POSITION(${name} IN p.id::text) > 0
    OR POSITION(${name} IN p.tags) > 0`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  get: async (id: number) => {

    const userQry = sql<iUserLogin>`select
    t.id, t.name, t.email, t.street, t.city, t.phone, t.spbu_id
    from users as t
    where t.id = p.user_id
    `;
    const detailQry = sql<iJournalDetail>`SELECT
      s.id, s.journal_id "journalId", s.coa_id "coaId", 
      s.debt, s.cred, s.description,
      s.created_at "createdAt", s.updated_at "updatedAt"
    FROM journal_detail s
    WHERE s.journal_id = p.id`;

    const customerQry = sql<iOperator>`select
    t.id, t.name, t.email, t.street, t.city, t.phone, t.spbu_id
    from users as t
    where t.id = p.customer_id
    `;
    const query = sql<iJournal>`SELECT
      p.id, p.code, p.ref_id, p.proof, p.user_id,
      to_char(p.date_transact, 'DD-MON-YYYY') AS "dateOutput",
      p.date_transact, p.tags, p.memo,
      p.created_at AS "createdAt", p.updated_at AS "updatedAt",
    ${nestQuery(detailQry)} as "details",
    ${nestQuerySingle(userQry)} as "operator",
    ${nestQuerySingle(customerQry)} as "supplier"
    FROM journal AS p
    WHERE p.id = ${id}`;


    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  listByDate: async (dateStart: string | string[], dateEnd: string | string[]) => {

    const operatorQry = sql<iOperator>`select
    t.id, t.name, t.email, t.street, t.city, t.phone, t.spbu_id
    from users as t
    where t.id = p.user_id
    `;
    const customerQry = sql<iOperator>`select
    t.id, t.name, t.email, t.street, t.city, t.phone, t.spbu_id
    from users as t
    where t.id = p.customer_id
    `;

    const query = sql<iJournal>`SELECT
      p.id,
      p.user_id,
      p.code,
      p.ref_id,
      p.code ||'-'|| to_char(p.id,'000000000') as proof,
      to_char(p.date_transact, 'DD-MON-YYYY') AS "dateOutput",
      p.date_transact,
      p.tags,
      p.memo,
      p.created_at,
      p.updated_at,
      ${nestQuerySingle(operatorQry)} as operator,
      ${nestQuerySingle(customerQry)} as customer
    FROM journal AS p
    WHERE p.date_transact >= to_timestamp(${dateParam(dateStart + '  1:01')}, ${hour24Format})
    AND p.date_transact <= to_timestamp(${dateParam(dateEnd + ' 23:59')}, ${hour24Format})
    `;

    //console.log(`WHERE p.date_transact >= to_timestamp('${dateParam(dateStart + '  1:01')}', '${hour24Format}')
    // AND p.date_transact <= to_timestamp('${dateParam(dateEnd + ' 11:59')}', '${hour24Format})'`)

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  listByStock: async (dateStart: string | string[], dateEnd: string | string[]) => {

    const operatorQry = sql<iOperator>`select
    t.id, t.name, t.email, t.street, t.city, t.phone, t.spbu_id
    from users as t
    where t.id = p.user_id
    `;
    const supplierQry = sql<iSupplier>`select
    t.id, t.name, t.email, t.street, t.city, t.phone, t.spbu_id
    from users as t
    where t.id = p.customer_id
    `;

    const query = sql<iJournal>`SELECT
      p.id,
      p.user_id,
      p.code,
      p.ref_id,
      p.code||'-'||trim(to_char(p.id,'000000000')) as proof,
      to_char(p.date_transact, 'DD-MON-YYYY') AS "dateOutput",
      p.date_transact,
      p.tags,
      p.memo,
      p.created_at,
      p.updated_at,
      ${nestQuerySingle(operatorQry)} as operator,
      ${nestQuerySingle(supplierQry)} as supplier
    FROM journal AS p
    WHERE p.code = 'ORD'
    AND (
      p.date_transact >= to_timestamp(${dateParam(dateStart + ' 01:01')}, ${hour24Format})
      AND p.date_transact <= to_timestamp(${dateParam(dateEnd + ' 23:59')}, ${hour24Format})
    )
    order by p.date_transact desc`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },
  delete: async (id: number) => {
    const query = sql<iJournal>`
    DELETE FROM journal
    WHERE id = ${id}
    RETURNING *
    `;
    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  update: async (id: number, p: iJournal) => {

    const query = sql<iJournal>`
      UPDATE journal SET
      code = ${p.code},
      ref_id = ${p.refId},
      tags = ${isNullOrEmpty(p.tags)},
      memo = ${isNullOrEmpty(p.memo)},
      date_transact = to_timestamp(${dateParam(p.dateTransact)}, ${hour24Format}),
      updated_at = to_timestamp(${dateParam(p.updatedAt)}, ${hour24Format})
      WHERE id = ${id}
      RETURNING id, code,
          ref_id,
          user_id,
          code ||'-'|| to_char(id, '000000000') as proof,
          to_char(date_transact, 'DD-MON-YYYY') AS "dateOutput",
          date_transact,
          tags,
          memo,
          created_at,
          updated_at
    `;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  insert: async (p: iJournal) => {
    //console.log(p)
    const query = sql<iJournal>`
      INSERT INTO journal (
          code,
          ref_id,
          user_id,
          date_transact,
          tags,
          memo,
          created_at,
          updated_at
        ) VALUES (
        ${p.code},
        ${p.refId},
        ${p.userId},
        to_timestamp(${dateParam(p.dateTransact)}, ${hour24Format}),
        ${isNullOrEmpty(p?.tags)},
        ${isNullOrEmpty(p?.memo)},
        to_timestamp(${dateParam(p?.createdAt)}, ${hour24Format}),
        to_timestamp(${dateParam(p?.updatedAt)}, ${hour24Format})
      )
      RETURNING id, code,
          ref_id,
          user_id,
          code ||'-'|| to_char(id, '000000000') proof,
          to_char(date_transact, 'DD-MON-YYYY') AS "dateOutput",
          date_transact,
          tags,
          memo,
          created_at,
          updated_at
    `;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },
};

export default apiJournal;
