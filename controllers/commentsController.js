import db from "../db/db.js";

export const getCommentPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT c.id,c.post_id,c.user_id,u.first_name,u.last_name,u.username,c.description,c.created_at FROM comments c INNER JOIN users u ON c.user_id = u.id WHERE c.post_Id = ? ORDER BY created_at desc",
      [postId]
    );

    return res.status(200).json({ comments: rows });
  } catch (e) {
    console.log(e.message);

    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const createComment = async (req, res) => {
  const { postId, userId } = req.params;
  try {
    const { description } = req.body;

    if (!description) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const query =
      "INSERT INTO comments (post_id,user_id,description) VALUES (?,?,?)";

    const values = [postId, userId, description];

    await db.query(query, values);

    const [rows] = await db.query(
      "SELECT c.*, u.first_name, u.last_name, u.username FROM comments c INNER JOIN users u ON c.user_id = u.id WHERE post_id = ? AND user_id = ? AND description = ?",
      [postId, userId, description]
    );

    const newComment = rows[0];

    return res
      .status(201)
      .json({ message: "Comentario creado con exito", newComment: newComment });
  } catch (e) {
    return res.status(500).json({ error: e, message: "Error en el servidor" });
  }
};
