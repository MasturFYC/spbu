import {
  createPool
} from 'slonik';
import { dateParam, hour24Format, iOrder } from '../../../components/interfaces'
import db, { sql } from "../config";


type apiReturn = Promise<any[] | (readonly iOrder[] | undefined)[]>;


const updateOrderSpbu = async (journalId: number, details: iOrder[], deletedIds: number[]) => {

  const pool = createPool(process.env.DATABASE_URL || '')

  if (details.filter(x => x.isNew).length > 0) {
    details.filter(x => x.isNew).map(async (p: iOrder, index: number) => {
      const qty = (p.meterCred - p.meterDebt);
      const total = qty * p.salePrice;
      await pool.query(sql`
      INSERT INTO orders (
        journal_id,
        product_id,
        type_id,
        qty,
        content,
        debt,
        cred,
        meter_debt,
        meter_cred,
        unit,
        buy_price,
        sale_price,
        sub_total,
        created_at,
        updated_at
      ) VALUES (
        ${journalId},
        ${p.productId},
        ${p.typeId},
        ${qty},
        ${p.content},
        ${0},
        ${qty * p.content},
        ${p.meterDebt},
        ${p.meterCred},
        ${p.unit},
        ${p.buyPrice},
        ${p.salePrice},
        ${total},
        to_timestamp(${dateParam(p.createdAt)}, ${hour24Format}),
        to_timestamp(${dateParam(p.updatedAt)}, ${hour24Format})
      )`)
    })
  }


  if (details.filter(x => !x.isNew).length > 0) {
    details.filter(x => !x.isNew).map(async (p: iOrder, index: number) => {
      const qty = (p.meterCred - p.meterDebt);
      const total = qty * p.salePrice;
      await pool.query(
        sql`UPDATE orders SET
        product_id = ${p.productId},
        type_id = ${p.typeId},
        qty = ${qty},
        content = ${p.content},
        debt = 0,
        cred = ${qty * p.content},
        meter_debt = ${p.meterDebt},
        meter_cred = ${p.meterCred},
        unit = ${p.unit},
        buy_price = ${p.buyPrice},
        sale_price = ${p.salePrice},
        sub_total = ${total},
        updated_at = to_timestamp(${dateParam(p.updatedAt)}, ${hour24Format})
      WHERE id = ${p.id}`)

    })
  }
  if (deletedIds.length > 0) {
    deletedIds.map(async (x) => {
      await pool.query(
        sql`DELETE FROM orders
        WHERE (id = ${x})
        RETURNING *`)
    })
  }

  return await pool.end();
}

const updateOrder = async (journalId: number, details: iOrder[], deletedIds: number[]) => {
  //  let res;

  const pool = createPool(process.env.DATABASE_URL || '')

  if (details.filter(x => x.isNew).length > 0) {
    details.filter(x => x.isNew).map(async (p: iOrder) => {
      await pool.query(sql`
      INSERT INTO orders (
        journal_id,
        product_id,
        type_id,
        qty,
        content,
        cred,
        unit,
        buy_price,
        sale_price,
        discount,
        sub_total,
        created_at,
        updated_at
      ) VALUES (
        ${journalId},
        ${p.productId},
        ${p.typeId},
        ${p.qty},
        ${p.content},
        ${p.qty * p.content},
        ${p.unit},
        ${p.buyPrice},
        ${p.salePrice},
        ${p.discount},
        ${p.subTotal},
        to_timestamp(${dateParam(p.createdAt)}, ${hour24Format}),
        to_timestamp(${dateParam(p.updatedAt)}, ${hour24Format})
      )`)
    })
  }


  if (details.filter(x => !x.isNew).length > 0) {
    details.filter(x => !x.isNew).map(async (p: iOrder) => {
      await pool.query(
        sql`UPDATE orders SET
        product_id = ${p.productId},
        type_id = ${p.typeId},
        qty = ${p.qty},
        content = ${p.content},
        cred = ${p.qty * p.content},
        unit = ${p.unit},
        buy_price = ${p.buyPrice},
        sale_price = ${p.salePrice},
        discount = ${p.discount},
        sub_total = ${p.subTotal},
        updated_at = to_timestamp(${dateParam(p.updatedAt)}, ${hour24Format})
      WHERE id = ${p.id}`)

    })
  }
  if (deletedIds.length > 0) {
    deletedIds.map(async (x) => {
      await pool.query(
        sql`DELETE FROM orders
        WHERE (id = ${x})
        RETURNING *`)
    })
  }

  return await pool.end();
}


interface apiFunction {
  getList: (journalId: number) => apiReturn;
  getListWithBarcode: (journalId: number) => apiReturn;
  updateSpbu: (id: number, data: iOrder[], deletedIds: number[]) => apiReturn;
  updateCommonOrder: (id: number, data: iOrder[], deletedIds: number[]) => apiReturn;
}

const apiOrder: apiFunction = {
  getListWithBarcode: async (journalId: number) => {

    const query = sql`select
      o.journal_id, o.id, o.product_id, o.type_id,
      o.qty, o.content, o.debt, o.cred, o.unit,
      o.buy_price, o.sale_price, o.discount, o.sub_total,
      o.created_at, o.updated_at, p.barcode, p.name
    FROM orders o join product p on p.id = o.product_id
    WHERE o.journal_id = ${journalId}`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },
  getList: async (journalId: number) => {

    const query = sql`select
      journal_id, id, product_id, type_id,
      qty, content, debt, cred, unit, meter_debt, meter_cred,
      buy_price, sale_price, sub_total,
      created_at, updated_at
    FROM orders
    WHERE journal_id = ${journalId}`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  updateSpbu: async (journalId: number, details: iOrder[], deletedIds: number[]) => {

    try {
      await updateOrderSpbu(journalId, details, deletedIds);
    } catch (e) {
      return ['error']
    }

    return ['OK'];
  },

  updateCommonOrder: async (journalId: number, details: iOrder[], deletedIds: number[]) => {

    try {
      await updateOrder(journalId, details, deletedIds);
    } catch (e) {
      return ['error']
    }

    return ['OK'];
  }

};

export default apiOrder;
