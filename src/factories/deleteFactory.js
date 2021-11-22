import connection from '../database/database.js';


const clearAllTables = async () => {
  const tables = [
    'user_city',
    'user_products',
    'user_state',
    'cities',
    'delivery',
    'delivery',
    'plan',
    'states',
    'sessions',
    'users'
  ];

  const deleteStr = tableName => `DELETE FROM ${tableName};`;

  const deleteAllStr = tables.reduce((acc, cur) => acc + deleteStr(cur), '');

  await connection.query(deleteAllStr);
};


export {
  clearAllTables,
};