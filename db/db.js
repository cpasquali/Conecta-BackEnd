import mysql2 from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = await mysql2.createConnection(process.env.MYSQL_URL);

export default db;
