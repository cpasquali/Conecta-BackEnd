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

    const [rows] = await db.query(
      `SELECT p.*,
	      u.first_name,u.last_name,u.username,u.image_url AS profile_img,
	      (SELECT COUNT(*) FROM
	      post_likes 
	      WHERE post_id = p.id) AS cant_likes
	      FROM posts p INNER JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
      `,
      [post_id]
    );

    const updatedPost = rows[0];

    return res
      .status(200)
      .json({ message: "Te gusta la publicación", updatedPost: updatedPost });
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

    const [rows] = await db.query(
      `SELECT p.*,
	      u.first_name,u.last_name,u.username,u.image_url AS profile_img,
	      (SELECT COUNT(*) FROM
	      post_likes 
	      WHERE post_id = p.id) AS cant_likes
	      FROM posts p INNER JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
      `,
      [post_id]
    );

    const updatedPost = rows[0];

    return res.status(200).json({
      message: "Ya no te gusta la publicación",
      updatedPost: updatedPost,
    });
  } catch (e) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
