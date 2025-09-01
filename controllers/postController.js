import db from "../db/db.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const getAllPosts = async (req, res) => {
  try {
    const query = `SELECT p.*,
	    u.first_name,u.last_name,u.username,	
	    (SELECT COUNT(*) FROM
	    post_likes 
	    WHERE post_id = p.id) AS cant_likes
	    FROM posts p INNER JOIN users u ON p.user_id = u.id
	    ORDER BY created_at
    DESC`;
    const [rowss] = await db.query(query);

    if (rowss.length === 0) {
      return res.status(404).json({ message: "No hay posts registrados" });
    }

    return res.status(200).json({ posts: rowss });
  } catch {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getAllPostByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const [rowss] = await db.query(
      `SELECT p.*,
    	  u.first_name,u.last_name,u.username,	
	      (SELECT COUNT(*) FROM
	      post_likes 
	      WHERE post_id = p.id) AS cant_likes
	      FROM posts p INNER JOIN users u ON p.user_id = u.id
        WHERE user_id = ?
	      ORDER BY created_at
      DESC`,
      [userId]
    );

    if (rowss.length === 0) {
      return res.status(404).json({
        message: `No hay post registrados por el usuario con id ${id}`,
      });
    }

    return res.status(200).json({ posts: rowss });
  } catch {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT p.*,
	      u.first_name,u.last_name,u.username,	
	      (SELECT COUNT(*) FROM
	      post_likes 
	      WHERE post_id = p.id) AS cant_likes
	      FROM posts p INNER JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
	      ORDER BY created_at
      DESC`,
      [id]
    );

    return res.status(200).json({ post: rows });
  } catch (e) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const createPost = async (req, res) => {
  const { userId } = req.params;
  try {
    const { title, description } = req.body;

    let image_url = null;

    if (req.file) {
      const resultImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
      });

      image_url = resultImage.secure_url;

      fs.unlink(req.file.path, (err) => {
        if (err) console.log("Error al intentar borrar el archivo temporal");
      });
    }

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const query =
      "INSERT INTO posts (user_id,title,description,image_url) VALUES (?,?,?,?)";

    const values = [userId, title, description, image_url];

    const [result] = await db.query(query, values);

    const [rows] = await db.query(
      `SELECT p.*,
	u.first_name,u.last_name,u.username,	
		(SELECT COUNT(*) FROM
	      post_likes 
	      WHERE post_id = p.id) AS cant_likes
	      FROM posts p INNER JOIN users u ON p.user_id = u.id
        WHERE p.id = ? AND user_id = ?`,
      [result.insertId, userId]
    );

    return res
      .status(200)
      .json({ newPost: rows[0], message: "Post creado con exito" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deletePost = async (req, res) => {
  const { id, userId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM posts WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    const post = rows[0];

    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    await db.query("DELETE FROM posts WHERE id = ? AND user_id = ?", [
      id,
      userId,
    ]);

    return res.status(200).json({ message: "Post eliminado con exito" });
  } catch {
    console.log(e.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
