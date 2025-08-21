import mysql2 from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = await mysql2.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

export default db;
