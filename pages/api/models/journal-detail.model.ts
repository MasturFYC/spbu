import { initJournalDetail } from '@lib/use-journal-detail';
import {
  createPool
} from 'slonik';
import { iJournalDetail, dateParam, hour24Format, isNullOrEmpty } from '../../../components/interfaces'
import { sql } from "../config";

type apiReturn = Promise<any[] | (readonly iJournalDetail[] | undefined)[]>;

interface apiFunction {
  //delete: (ids: number[]) => apiReturn;
  update: (journalId: number, details: iJournalDetail[], deletes: number[]) => apiReturn;
  // insert: (data: iJournalDetail[]) => apiReturn;
}

const updateJournalDetail = async (journalId: number, details: iJournalDetail[], ids: number[]) => {

  const pool = createPool(process.env.DATABASE_URL || '')

  if (details.filter(x => x.isNew).length > 0) {
    details.filter(x => x.isNew).map(async (p: iJournalDetail) => {
      await pool.query(
        sql`INSERT INTO journal_detail (journal_id, coa_id, description, updated_at, created_at, debt, cred) values (
         ${journalId},
         ${p.coaId},
         ${isNullOrEmpty(p.description)},
         to_timestamp(${dateParam(p.updatedAt)}, ${hour24Format}),
         to_timestamp(${dateParam(p.createdAt)}, ${hour24Format}),
         ${p.debt},
         ${p.cred})`
      );
    })
  }

  if (details.filter(x => !x.isNew).length > 0) {

   // console.log('------------------------------', details);

    details.filter(x => !x.isNew).map(async (p: iJournalDetail) => {

      await pool.query(
        sql`UPDATE journal_detail SET
          journal_id = ${journalId},
          coa_id = ${p.coaId},
          description = ${isNullOrEmpty(p?.description)},
          updated_at = to_timestamp(${dateParam(p.updatedAt)}, ${hour24Format}),
          debt = ${p.debt},
          cred = ${p.cred}
        WHERE id = ${p.id}`)

    })
  }
  if (ids.length > 0) {
    ids.map(async (x) => {
      await pool.query(
        sql`DELETE FROM journal_detail
        WHERE (id = ${x})
        RETURNING *`)
    })
  }

  return await pool.end();
}

const apiJournalDetail: apiFunction = {

  // delete: async (ids: number[]) => {

  //   await db.transaction(async (transact) => {
  //     ids.map(async (x) => {
  //       await transact.query(sql`DELETE FROM journal_detail
  //           WHERE id = ${x}
  //           RETURNING *
  //       `)
  //     })
  //   })

  //   return true;

  // },

  update: async (journalId: number, details: iJournalDetail[], ids: number[]) => {

    try {
      await updateJournalDetail(journalId, details, ids);
    } catch (e) {
      return ['error']
    }

    return ['OK'];
  }
};

export default apiJournalDetail;
