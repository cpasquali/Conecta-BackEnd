import mysql2 from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = await mysql2.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});

export default db;
