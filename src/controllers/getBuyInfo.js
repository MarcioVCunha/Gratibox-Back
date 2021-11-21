import connection from '../database/database.js';

const getBuyInfo = async (req, res) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  let planInfo = {};

  try {

    const userId = await connection.query(`
      SELECT
        user_id
      FROM
        sessions
      WHERE
        token = $1;
    `, [token]);

    const plan = await connection.query(`
      SELECT
        type, delivery_date, sign_date
      FROM
        plan
      WHERE
        user_id = $1;
    `, [userId.rows[0].user_id]);

    const products = await connection.query(`
      SELECT
        products.product_name
      FROM
        products
      JOIN
        user_products
      ON
        user_products.product_id = products.id
      WHERE
        user_id = $1;
    `, [userId.rows[0].user_id]);

    planInfo.delivery_date = plan.rows[0].delivery_date;
    planInfo.sign_date = plan.rows[0].sign_date;
    planInfo.type = plan.rows[0].type;
    planInfo.products = products.rows;

    res.send(planInfo).status(200);
  } catch (error) {
    res.sendStatus(500);
    console.log(500);
    return;
  }
};

export default getBuyInfo;