import db from "../db/db.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  try {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;

    const { emailOrUsername, password } = req.body;

    let query;

    if (regex.test(emailOrUsername)) {
      query = `SELECT * FROM users WHERE email = ?`;
    } else {
      query = `SELECT * FROM users WHERE username = ?`;
    }

    const [row] = await db.query(query, [emailOrUsername]);

    const user = row[0];

    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    return res.status(200).json({
      message: "Sesion iniciada con exito",
      user: user,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: `${e.message}` });
  }
};

export const register = async (req, res) => {
  try {
    const { first_name, last_name, username, email, password } = req.body;

    const [rowEmail] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rowEmail.length > 0) {
      return res.status(400).json({ message: "Email ya registrado" });
    }

    const [rowUsername] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rowUsername.length > 0) {
      return res
        .status(400)
        .json({ message: "Nombre de usuario ya registrado" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const query =
      "INSERT INTO users (first_name, last_name,username,email,password) VALUES (? ,? ,? ,? ,?)";

    const values = [first_name, last_name, username, email, hashedPassword];

    await db.query(query, values);

    const [row] = await db.query(
      "SELECT * FROM users WHERE email = ? AND username = ?",
      [email, username]
    );

    const newUser = row[0];

    return res
      .status(201)
      .json({ message: "Usuario creado con exito", newUser: newUser });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
