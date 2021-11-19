import connection from '../database/database.js';

const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  try {
    const promisse = await connection.query(`
      SELECT * FROM sessions
        WHERE token = $1;
    `, [token]);

    if (promisse.rowCount === 0) return res.sendStatus(401);

    req.userId = promisse.rows[0].user_id;

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

  next();
};

export {
  auth,
};