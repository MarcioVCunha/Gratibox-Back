import connection from '../database/database.js';
import dayjs from 'dayjs';

const postBuyInfo = async (req, res) => {
  const token = req.headers.authorization.replace('Bearer ', '');

  try {
    const userId = await connection.query(`
      SELECT
        user_id
      FROM
        sessions
      WHERE
        token = $1;
    `, [token]);

    const userHasPlan = await connection.query(`
      SELECT
        *
      FROM
        user_products
      WHERE
        user_id = $1;    
    `, [userId.rows[0].user_id]);

    if (userHasPlan.rowCount !== 0) {
      res.sendStatus(500);
      return;
    }

    if (req.body.product.tea === true) {
      await connection.query(`
        INSERT INTO
          user_products (user_id, product_id)
        VALUES
          ($1, $2);
      `, [userId.rows[0].user_id, 1]);
    }

    if (req.body.product.incense === true) {
      await connection.query(`
        INSERT INTO
          user_products (user_id, product_id)
        VALUES
          ($1, $2);
      `, [userId.rows[0].user_id, 2]);
    }

    if (req.body.product.organic === true) {
      await connection.query(`
        INSERT INTO
          user_products (user_id, product_id)
        VALUES
          ($1, $2);
      `, [userId.rows[0].user_id, 3]);
    }

    let userCity = await connection.query(`
      SELECT
        *
      FROM
        cities
      WHERE
        name = $1;
    `, [req.body.delivery.city]);

    if (userCity.rowCount === 0) {
      await connection.query(`
        INSERT INTO
          cities (name)
        VALUES
          ($1);
      `, [req.body.delivery.city]);

      userCity = await connection.query(`
        SELECT
          *
        FROM
          cities
        WHERE
          name = $1;
      `, [req.body.delivery.city]);
    }

    await connection.query(`
      INSERT INTO
        user_city (user_id, city_id)
      VALUES
        ($1, $2)
    `, [userId.rows[0].user_id, userCity.rows[0].id]);

    await connection.query(`
      INSERT INTO
        delivery (user_id, adress, zipcode)
      VALUES
        ($1, $2, $3);
    `, [userId.rows[0].user_id, req.body.delivery.address, req.body.delivery.zipCode]);

    await connection.query(`
      INSERT INTO
        plan (user_id, type, delivery_date, sign_date)
      VALUES
        ($1, $2, $3, $4);
    `, [userId.rows[0].user_id, req.body.product.plan, req.body.delivery.date, dayjs().format('DD/MM/YY')]);

    let userState = await connection.query(`
      SELECT
      *
      FROM
        states
      WHERE
        name = $1;
    `, [req.body.delivery.state]);

    if (userState.rowCount === 0) {
      await connection.query(`
        INSERT INTO
          states (name)
        VALUES
          ($1);
      `, [req.body.delivery.state]);

      userState = await connection.query(`
        SELECT
          *
        FROM
          states
        WHERE
          name = $1;
      `, [req.body.delivery.state]);
    }

    await connection.query(`
      INSERT INTO
        user_state (user_id, state_id)
      VALUES
        ($1, $2)
    `, [userId.rows[0].user_id, userState.rows[0].id]);

    res.sendStatus(200);
    return;
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
    return;
  }
};

export default postBuyInfo;