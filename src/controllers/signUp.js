import connection from '../database/database.js';
import bcrypt from 'bcrypt';

const signUp = async (req, res) => {
  try {
    const { name, email, password } = (req.body);

    const repeatedUser = await connection.query(`
      SELECT
        *
      FROM
        users
      WHERE
        email = $1;
      `, [email]);

    if (repeatedUser.rowCount === 0) {
      const hash = bcrypt.hashSync(password, 10);

      connection.query(`
        INSERT INTO 
          users (name, email, password) 
        VALUES 
          ($1, $2, $3);
      `, [name, email, hash]);

      res.sendStatus(201);
      return;
    }

    res.send(409);
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
};

export default signUp;