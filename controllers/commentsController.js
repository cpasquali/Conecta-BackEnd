import db from "../db/db.js";

export const getCommentPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT c.id,c.post_id,c.user_id,u.first_name,u.last_name,u.username,c.description,c.created_at FROM comments c INNER JOIN users u ON c.user_id = u.id WHERE c.post_Id = ?",
      [postId]
    );

    return res.status(200).json({ comments: rows });
  } catch {
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

    return res.status(201).json({ message: "Comentario creado con exito" });
  } catch (e) {
    return res.status(500).json({ error: e, message: "Error en el servidor" });
  }
};
