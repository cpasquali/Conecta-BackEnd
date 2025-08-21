import db from "../db/db.js";

export const getUserFollowing = async (req, res) => {
  const { id_user_follower } = req.params;
  try {
    const query = "SELECT * FROM user_followers WHERE id_user_follower = ?";
    const values = [id_user_follower];

    const [rows] = await db.query(query, values);

    const cantFollowers = rows ? rows.length : 0;
    return res.status(200).json({ followers: rows, following: cantFollowers });
  } catch (e) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const addFollow = async (req, res) => {
  const { id_user_following, id_user_follower } = req.params;
  try {
    await db.query(
      "INSERT INTO user_followers (id_user_following, id_user_follower) VALUES (?,?)",
      [id_user_following, id_user_follower]
    );

    console.log("e");

    return res.status(201).json({ message: "Usuario seguido con exito" });
  } catch (e) {
    return res.status(500).json({ mesage: "Error en el servidor" });
  }
};

export const removeFollower = async (req, res) => {
  const { id_user_following, id_user_follower } = req.params;
  try {
    await db.query(
      "DELETE FROM user_followers WHERE id_user_following = ? AND id_user_follower = ?",
      [id_user_following, id_user_follower]
    );

    return res
      .status(200)
      .json({ message: "Haz dejado de seguir a este usuario" });
  } catch (e) {
    return res.status(500).json({ mesage: "Error en el servidor" });
  }
};
