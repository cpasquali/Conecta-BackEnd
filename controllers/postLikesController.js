import db from "../db/db.js";

export const getUserPostLike = async (req, res) => {
  const { post_id, user_id } = req.params;
  try {
    const [row] = await db.query(
      "SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?",
      [post_id, user_id]
    );

    if (!row.length) {
      return res.status(200).json({ liked: false });
    }

    return res.status(200).json({ liked: true });
  } catch (e) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const addPostLike = async (req, res) => {
  const { post_id, user_id } = req.params;
  try {
    await db.query("INSERT INTO post_likes (post_id, user_id) VALUES (?,?)", [
      post_id,
      user_id,
    ]);

    return res.status(200).json({ message: "Like agregado" });
  } catch (e) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deletePostLike = async (req, res) => {
  const { post_id, user_id } = req.params;
  try {
    await db.query("DELETE FROM post_likes WHERE post_id = ? AND user_id = ?", [
      post_id,
      user_id,
    ]);

    return res.status(200).json({ message: "Like eliminado" });
  } catch (e) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
