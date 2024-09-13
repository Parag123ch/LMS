const mysql = require("mysql");

const options = {
  connectionLimit: 100,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: 3306,
  createDatabaseTable: true,
};

const pool = mysql.createPool(options);

pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log(`Database connected succesfully`);
  connection.release((error) => (error ? reject(error) : resolve()));
});

(module.exports = pool), options;
