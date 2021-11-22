import pg from 'pg';
import process from 'process';

const { Pool } = pg;

const {
  NODE_ENV,
  DB_USER,
  DB_PASS,
  DB_PORT,
  DB_HOST,
  DB_NAME,
  DATABASE_URL
} = process.env;

const databaseConfig = (NODE_ENV === 'production')
  ? {
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnautorized: false,
    },
  }
  : {
    user: DB_USER,
    password: DB_PASS,
    port: DB_PORT,
    host: DB_HOST,
    database: DB_NAME,
  };

const connection = new Pool(databaseConfig);

export default connection;
