import { dateParam, hour24Format, iProduct, iProductSold, isNullOrEmpty } from '../../../components/interfaces'
import db, { nestQuerySingle, sql } from "../config";


type apiReturn = Promise<any[] | (readonly iProduct[] | iProductSold[] | undefined)[]>;

interface apiFunction {
  getProduct: (id: number) => apiReturn;
  getProductBySpbu: (spbuId: number) => apiReturn;
  getList: () => apiReturn;
  search: (name: string | string[]) => apiReturn;
  delete: (id: number) => apiReturn;
  update: (id: number, data: iProduct) => apiReturn;
  insert: (data: iProduct) => apiReturn;
}

const apiProduct: apiFunction = {
  search: async (name: string | string[]) => {
    // const querySPBU = sql`SELECT t.id, t.name
    // FROM public.spbu AS t
    // WEHERE t.id == spbu_id`;

    const query = sql<iProduct>`select id, code, name, buy_price, sale_price, octan, created_at, updated_at,
    parent_id, spbu_id, barcode, be_sold, content, unit, description,
    RPAD(code::text, 4, '0') as parent_code
    FROM product
    WHERE POSITION(${name} IN LOWER(name)) > 0 AND id != 0`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  getProductBySpbu: async (spbuId: number) => {

    const getLastMeterQry = sql`SELECT e.meter_debt as debt, e.meter_cred as cred
    FROM orders AS e
    WHERE e.product_id = t.id
    ORDER BY e.id DESC
    LIMIT 1`;

    const query = sql<iProductSold>`select
      t.id, t.code, t.name,
      t.buy_price, t.sale_price, t.barcode, t.content, t.unit,
      t.description, RPAD(t.code::text, 4, '0') as parent_code, t.first_stock,
      ${nestQuerySingle(getLastMeterQry)} as stock
    from product as t
    where t.spbu_id = ${spbuId} AND t.be_sold = true
    order by t.name`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  getProduct: async (id: number) => {

    const query = sql<iProduct>`select id, code, name, buy_price, sale_price, octan, created_at, updated_at,
    parent_id, spbu_id, barcode, be_sold, content, unit, description,
    RPAD(code::text, 4, '0') as parent_code
      FROM product
      WHERE id = ${id}`;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  getList: async () => {

    // const querySPBU = sql`SELECT t.id, t.name
    //   FROM public.spbu AS t
    //   WEHERE t.id == spbu_id`;

    const query = sql<iProduct>`with recursive prod_tree as (
    select id, code, name, buy_price, sale_price, octan, created_at, updated_at,
      parent_id, spbu_id, barcode, be_sold, content, unit, description, first_stock,
      RPAD(code::text, 4, '0') as parent_code
    from product
    where parent_id = 0 AND id != 0
    union all
    select p.id, p.code, p.name, p.buy_price, p.sale_price, p.octan, p.created_at, p.updated_at, 
      p.parent_id, p.spbu_id, p.barcode, p.be_sold, p.content, p.unit, p.description, p.first_stock,
      RPAD(p.code::text, 4, '0') as parent_code
    from product as p
    join prod_tree t on p.parent_id = t.id
    )
    select id, code, name, buy_price, sale_price, octan, created_at, updated_at, 
    parent_id, spbu_id, barcode, be_sold, content, unit, description, first_stock, parent_code
    from prod_tree
    where be_sold = true`;

    return await db
      .query(query)
      .then((data) => [data.rows, undefined])
      .catch((error) => [undefined, error]);
  },

  delete: async (id: number) => {
    const query = sql<iProduct>`
    DELETE FROM product
    WHERE id = ${id}
    RETURNING *
    `;
    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  update: async (id: number, p: iProduct) => {

    const query = sql<iProduct>`
      UPDATE product SET
      code= ${p.code},
      name = ${p.name},
      barcode = ${p.barcode},
      be_sold = ${p.beSold},
      parent_id = ${p.parentId},
      spbu_id = ${p.spbuId},
      unit = ${p.unit},
      octan = ${p.octan},
      buy_price= ${p.buyPrice},
      sale_price= ${p.salePrice},
      content=${p.content},
      first_stock=${p.firstStock},
      updated_at = to_timestamp(${dateParam(p.updatedAt)}, ${hour24Format}),
      description = ${p.description ? p.description : null}
      WHERE id = ${id}
      RETURNING *, RPAD(code::text, 4, '0') as parent_code
    `;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },

  insert: async (p: iProduct) => {
    const query = sql<iProduct>`
      INSERT INTO product (
        code, name, unit, octan, buy_Price, sale_price, 
        spbu_id, be_sold, parent_id, content, barcode,
        first_Stock, description
      ) VALUES (
        ${p.code},
        ${p.name},
        ${p.unit},
        ${p.octan},
        ${p.buyPrice},
        ${p.salePrice},
        ${p.spbuId},
        ${p.beSold},
        ${p.parentId},
        ${p.content},
        ${p.barcode},
        ${p.firstStock},
        ${isNullOrEmpty(p.description)}
      )
      RETURNING *, RPAD(code::text, 4, '0') as parent_code
    `;

    return await db
      .query(query)
      .then((data) => [data.rows[0], undefined])
      .catch((error) => [undefined, error]);
  },
};

export default apiProduct;
