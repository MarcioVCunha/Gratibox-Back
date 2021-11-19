import connection from '../database/database.js';

const getUserInfo = async (req, res) => {
  const token = (req.headers.authorization.replace('Bearer ', ''));
  let userInfo;

  try {
    const userId = await connection.query(`
      SELECT
        users.id
      FROM
        users
      JOIN
        sessions
      ON
        users.id = sessions.user_id
      WHERE
        sessions.token = $1;  
    `, [token]);

    const userName = await connection.query(`
      SELECT
        name
      FROM
        users
      WHERE
        id = $1;
    `, [userId.rows[0].id]);

    const userPlan = await connection.query(`
      SELECT
        type, delivery_date
      FROM
        plan
      WHERE
        user_id = $1;
    `, [userId.rows[0].id]);

    if (userPlan.rowCount === 0) {
      userInfo = {
        id: userId.rows[0].id,
        name: userName.rows[0].name
      };
    } else {
      userInfo = {
        id: userId.rows[0].id,
        name: userName.rows[0].name,
        userPlan: userPlan.rows[0].type
      };
    }

    res.status(200).send(userInfo);
  } catch (error) {
    console.log(error);
    res.sendStatus(200);
  }
};

export default getUserInfo;