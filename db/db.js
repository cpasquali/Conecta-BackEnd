import mysql2 from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql2.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

export default db;
