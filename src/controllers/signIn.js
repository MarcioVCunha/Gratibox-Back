import connection from '../database/database.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await connection.query(`
      SELECT
        *
      FROM
        users
      WHERE
        email = $1;
    `, [email]);

    if (user.rowCount === 0 || !bcrypt.compare(password, user.rows[0].password)) {
      res.status(404).send('Email ou senha incorretos.');
      return;
    }

    await connection.query(`
      DELETE FROM
        sessions
      WHERE
        user_id = $1;
    `, [user.rows[0].id]);

    const token = uuid();

    await connection.query(`
      INSERT INTO
        sessions (user_id, token)
      VALUES
        ($1, $2);
    `, [user.rows[0].id, token]);
    
    res.status(200).send(token);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
};

export default signIn;