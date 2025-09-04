import db from "../db/db.js";
import bcrypt from "bcrypt";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const getAllUsers = async (req, res) => {
  const { username, email } = req.query;

  try {
    let query = `SELECT 
        u.*,
        (SELECT COUNT(*) 
        FROM user_followers 
        WHERE id_user_following = u.id) AS cant_followers,
        (SELECT COUNT(*) 
        FROM user_followers 
        WHERE id_user_follower = u.id) AS cant_following
        FROM users u
      `;
    let values = [];

    if (username) {
      query += " WHERE username LIKE ?";
      values.push(`${username}%`);
    } else if (email) {
      query += " WHERE email LIKE ?";
      values.push(`${email}%`);
    } else {
      query += " ORDER BY RAND()";
    }

    const [rows] = await db.query(query, values);

    if (rows.length === 0) {
      return res.status(200).json({
        message: username
          ? `No hay resultados para la busqueda...`
          : "No hay usuarios registrados",
      });
    }

    return res.status(200).json({ users: rows });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { first_name, last_name } = req.body;
    let values = [];
    let updatesFields = [];

    if (!first_name && !last_name && !req.file) {
      return res.status(404).json({
        message: "Se deben ingresar almenos uno de los datos para actualizar",
      });
    }

    if (first_name) {
      updatesFields.push("first_name = ?");
      values.push(first_name);
    }

    if (last_name) {
      updatesFields.push("last_name = ?");
      values.push(last_name);
    }

    if (req.file) {
      const imageResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "images",
      });
      const image_url = imageResult.secure_url;

      updatesFields.push("image_url = ?");
      values.push(image_url);

      fs.unlink(req.file.path, (err) => {
        if (err) console.log("Error al eliminar el archivo");
      });
    }

    await db.query(
      `UPDATE users SET ${updatesFields.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

    return res
      .status(200)
      .json({ message: "Actualizacion completada!!", updatedUser: rows[0] });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const [row] = await db.query(
      `SELECT 
        u.*,
        (SELECT COUNT(*) 
        FROM user_followers 
        WHERE id_user_following = u.id) AS cant_followers,
        (SELECT COUNT(*) 
        FROM user_followers 
        WHERE id_user_follower = u.id) AS cant_following
        FROM users u
      WHERE u.username = ?;`,
      [username]
    );

    if (row.length === 0) {
      return res
        .status(404)
        .json({ message: `Usuario con username: ${username} no encontrado` });
    }

    return res.status(200).json({ users: row });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { password } = req.body;
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);
    return res.status(200).json({ message: "Usuario eliminado con exito" });
  } catch {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
